import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const Ctx = createContext(null);

export function AccessibilityProvider({ children }) {
  // Default OFF
  const [zoomLevel, setZoomLevel] = useState(() => {
    const saved = localStorage.getItem("a11y:zoomLevel");
    return saved ? Number(saved) : 100; // %
  });
  const [userAdjustedZoom, setUserAdjustedZoom] = useState(() => {
    const saved = localStorage.getItem("a11y:userAdjusted");
    return saved ? saved === "true" : false; // off until user opts in
  });

  useEffect(() => {
    localStorage.setItem("a11y:zoomLevel", String(zoomLevel));
    localStorage.setItem("a11y:userAdjusted", String(userAdjustedZoom));

    const factor = userAdjustedZoom ? zoomLevel / 100 : 1;
    document.documentElement.style.setProperty("--text-zoom", String(factor));

    if (!userAdjustedZoom || zoomLevel === 100) {
      document.body.style.removeProperty("zoom");  // OFF by default
    } else {
      document.body.style.zoom = `${zoomLevel}%`;  // Only after opt-in
    }
  }, [zoomLevel, userAdjustedZoom]);

  const api = useMemo(() => ({
    zoomLevel,
    userAdjustedZoom,
    setZoomLevel: (z) => { setZoomLevel(z); setUserAdjustedZoom(true); },
    zoomIn:  () => { setZoomLevel((z) => Math.min(z + 10, 150)); setUserAdjustedZoom(true); },
    zoomOut: () => { setZoomLevel((z) => Math.max(z - 10, 50));  setUserAdjustedZoom(true); },
    resetZoom: () => { setZoomLevel(100); setUserAdjustedZoom(true); },
  }), [zoomLevel, userAdjustedZoom]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useAccessibility() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAccessibility must be used within <AccessibilityProvider>");
  return v;
}
