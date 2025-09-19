// src/auth/useCSRF.ts
"use client";

import useSWR from "swr";

// Gunakan fetcher default dari SWRConfig
export function useCSRF() {
  return useSWR(
    "/_allauth/browser/v1/auth/csrf",
    (url: string) => fetch(url, { credentials: "include" }),  // hanya perlu fetch saja
    {
      revalidateOnFocus: false,
      dedupingInterval: 5 * 60 * 1000,  // satu kali fetch tiap 5 menit
    }
  );
}
