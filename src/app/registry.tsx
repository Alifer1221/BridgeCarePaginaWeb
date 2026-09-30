"use client";

import React, { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { StyleRegistry, createStyleRegistry } from "styled-jsx";

/**
 * Collects every component's <style jsx> during server rendering and writes
 * it into the HTML, so pages arrive already styled. Without it, those styles
 * are only injected once JavaScript runs, and a reload shows the page
 * unstyled for a moment (plain stacked text) before it snaps into place.
 */
export default function StyledJsxRegistry({ children }: { children: React.ReactNode }) {
  // Created once per request, lazily, so it isn't rebuilt on every render.
  const [jsxStyleRegistry] = useState(() => createStyleRegistry());

  useServerInsertedHTML(() => {
    const styles = jsxStyleRegistry.styles();
    jsxStyleRegistry.flush();
    return <>{styles}</>;
  });

  return <StyleRegistry registry={jsxStyleRegistry}>{children}</StyleRegistry>;
}
