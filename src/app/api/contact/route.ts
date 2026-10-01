import { NextResponse } from "next/server";

interface ContactPayload {
  name?: string;
  email?: string;
  phone?: string;
  specialty?: string;
  message?: string;
}

// Where lead notifications land. Override with CONTACT_TO_EMAIL if needed.
const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "info@bridgecare.co";

export async function POST(request: Request) {
  let data: ContactPayload;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const { name, email, phone, specialty, message } = data;
  if (!name || !email) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  let emailSent = false;

  if (apiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Resend's shared test sender — works without verifying a domain,
          // but only delivers to the email address tied to the Resend
          // account. Once wearebridgecare.com is a verified domain in Resend,
          // switch this to something like "Bridge Care <leads@wearebridgecare.com>".
          from: "Bridge Care <onboarding@resend.dev>",
          to: [TO_EMAIL],
          reply_to: email,
          subject: `Nueva solicitud — ${name}${specialty ? ` (${specialty})` : ""}`,
          text: [
            `Nombre: ${name}`,
            `Email: ${email}`,
            `Teléfono: ${phone || "—"}`,
            `Especialidad: ${specialty || "—"}`,
            "",
            "Mensaje:",
            message || "—",
          ].join("\n"),
        }),
      });
      emailSent = res.ok;
      if (!res.ok) {
        console.error("Resend error:", res.status, await res.text());
      }
    } catch (err) {
      console.error("Failed to send contact email:", err);
    }
  } else {
    // No email provider configured yet. Log the lead server-side so it is at
    // least visible in the hosting platform's function logs (e.g. Vercel →
    // Project → Logs) instead of disappearing silently. See README for how
    // to add a RESEND_API_KEY and start receiving real emails.
    console.log("New contact lead (no RESEND_API_KEY set):", {
      name,
      email,
      phone,
      specialty,
      message,
    });
  }

  return NextResponse.json({ ok: true, emailSent });
}
