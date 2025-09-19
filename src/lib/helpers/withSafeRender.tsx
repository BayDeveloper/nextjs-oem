// === src/lib/helpers/withSafeRender.tsx ===
'use client'

import React, { JSX } from 'react'

/**
 * HOC untuk menunda render komponen sampai kondisi isReady() terpenuhi.
 * @param Component Komponen React yang ingin dibungkus.
 * @param isReady   Fungsi yang mengembalikan boolean; render hanya ketika true.
 * @param Fallback  Konten yang dirender sementara isReady() masih false.
 */
export function withSafeRender<T extends JSX.IntrinsicAttributes>(
  Component: React.ComponentType<T>,
  isReady: () => boolean,
  Fallback: React.ReactNode = <p>Memuat...</p>
) {
  return function WrappedComponent(props: T) {
    // Jika belum siap, tampilkan fallback
    if (!isReady()) {
      return <>{Fallback} </>
    }
    // Setelah siap, render komponen utama
    return <Component {...props} />
  }
}
