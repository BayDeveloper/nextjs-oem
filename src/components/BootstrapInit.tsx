// components/BootstrapInit.tsx
"use client";

import { useEffect } from "react";

export default function BootstrapInit() {
  useEffect(() => {
    // Import bootstrap bundle JS di client
    import("bootstrap/dist/js/bootstrap.bundle.min.js").then((bootstrap) => {
      // Setelah bundle siap, aktifkan semua tooltip
      const tooltipTriggerList = Array.from(
        document.querySelectorAll('[data-bs-toggle="tooltip"]')
      );
      tooltipTriggerList.forEach(
        (el) => new bootstrap.Tooltip(el as HTMLElement)
      );
    });
  }, []);

  return null;
}
