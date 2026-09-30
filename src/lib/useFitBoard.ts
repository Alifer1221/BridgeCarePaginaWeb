"use client";

import { useEffect, useRef } from "react";

/**
 * Screen-aware layout for the sections drawn from a 1440 px design board.
 *
 * The old approach zoomed a fixed board to fit the screen, so a wide but
 * short laptop (say 1490 x 705) got a shrunken copy of a tall layout with
 * empty sides. This reads the screen FIRST and lays the board out for it:
 *
 *  - The board always spans the screen's width (zoom = width / 1440).
 *  - --bh: the height the board can use, in its own pixels, clamped to what
 *    the design allows (minH..maxH). Fixed-height layouts size their photo,
 *    phone, type and spacing from it.
 *  - --fit (fitContent): for layouts whose height comes from their content,
 *    a 0..1 factor the layout multiplies its big type and vertical spacing by,
 *    chosen so the content fits the screen before anything is scaled down.
 *  - Only on screens shorter than the smallest layout does the zoom drop
 *    below the width ratio.
 *
 * Phones and tablets (below minWidth) get the section's own stacked layout:
 * no zoom and no variables.
 */
export function useFitBoard<T extends HTMLElement>({
  minH,
  maxH,
  fitContent = false,
  minFit = 0.78,
  minWidth = 901,
  onFit,
}: {
  minH: number;
  maxH: number;
  fitContent?: boolean;
  minFit?: number;
  minWidth?: number;
  /** Runs after each fit with the final zoom and board height. */
  onFit?: (el: T, zoom: number, bh: number) => void;
}) {
  const ref = useRef<T>(null);
  const onFitRef = useRef(onFit);
  useEffect(() => {
    onFitRef.current = onFit;
  }, [onFit]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const desktop = window.matchMedia(`(min-width: ${minWidth}px)`);
    const fit = () => {
      if (!desktop.matches) {
        el.style.zoom = "";
        el.style.removeProperty("--bh");
        el.style.removeProperty("--fit");
        onFitRef.current?.(el, 1, 0);
        return;
      }
      const kW = document.documentElement.clientWidth / 1440;
      const available = window.innerHeight / kW;
      const bh = Math.max(minH, Math.min(maxH, available));
      el.style.setProperty("--bh", `${bh}px`);
      let zoom: number;
      if (fitContent) {
        el.style.zoom = "1";
        el.style.setProperty("--fit", "1");
        const natural = el.offsetHeight;
        const f = Math.max(minFit, Math.min(1, available / natural));
        el.style.setProperty("--fit", String(f));
        zoom = Math.min(kW, window.innerHeight / el.offsetHeight);
      } else {
        zoom = Math.min(kW, window.innerHeight / bh);
      }
      el.style.zoom = String(zoom);
      onFitRef.current?.(el, zoom, bh);
    };
    fit();
    window.addEventListener("resize", fit);
    desktop.addEventListener("change", fit);
    // Web fonts change heights once they load.
    document.fonts?.ready.then(fit).catch(() => {});
    return () => {
      window.removeEventListener("resize", fit);
      desktop.removeEventListener("change", fit);
    };
  }, [minH, maxH, fitContent, minFit, minWidth]);

  return ref;
}
