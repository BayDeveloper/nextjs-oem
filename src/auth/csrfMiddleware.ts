// src/auth/csrfMiddleware.ts
import { Middleware } from "swr";
import { getCSRFToken } from "../lib/django";

// Middleware SWR untuk inject CSRF secara transparan
export const csrfMiddleware: Middleware = (useSWRNext) => {
  return (key, fetcher, config) => {
    if (!fetcher) {
      throw new Error("csrfMiddleware requires a fetcher");
    }

    const fetcherWithCSRF: typeof fetcher = async (url, init?) => {
      // Hanya fetch CSRF jika token belum ada
      let token = getCSRFToken();
      if (!token) {
        await fetch("https://backend.oem-x.my.id/_allauth/browser/v1/auth/csrf", {
          credentials: "include",
        });
        token = getCSRFToken(); // ambil ulang
      }

      const headers = {
        ...(init?.headers ?? {}),
        "X-CSRFToken": token ?? "",
      };

      return fetcher(url, {
        ...init,
        headers,
        credentials: "include",
      } as any);
    };

    return useSWRNext(key, fetcherWithCSRF, config);
  };
};
