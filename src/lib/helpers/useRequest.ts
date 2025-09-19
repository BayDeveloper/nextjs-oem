// lib/helpers/useRequest.ts
import { useState, useCallback } from 'react';

type RequestFn<T, A extends unknown[]> = (...args: A) => Promise<T>;

// K: tipe ID bisa number atau string tergantung kebutuhan
export function useRequest<
  T,
  A extends unknown[] = unknown[],
  K extends number | string = number
>(
  fn: RequestFn<T, A>,
  options?: { idIndex?: number } // index argumen yang mengandung ID
) {
  const [error, setError] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<K | null>(null);

  const trigger = useCallback(
    async (...args: A): Promise<T | null> => {
      setError(null);

      // Tangkap ID dari argumen kalau ada
      if (typeof options?.idIndex === 'number') {
        const maybeId = args[options.idIndex] as K;
        if (maybeId !== undefined) {
          setLoadingId(maybeId);
        }
      } else {
        // fallback: pakai 'GLOBAL' sebagai indikator loading umum
        setLoadingId('GLOBAL' as K);
      }

      try {
        const resp = await fn(...args);
        return resp;
      } catch (err) {
        const e = err as { message?: string; data?: { detail?: string } };
        const msg =
          e?.data?.detail ||
          e?.message ||
          'Terjadi kesalahan. Coba lagi nanti.';
        setError(msg);
        return null;
      } finally {
        setLoadingId(null);
      }
    },
    [fn, options?.idIndex]
  );

  return { trigger, error, loadingId };
}
