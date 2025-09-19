// src/app/account/metadata.ts
import type { Metadata } from "next"

export const accountMetadata: Metadata = {
  title: "Akun | OEM-X",
  description: "Kelola akun Anda di OEM-X.",
  robots: {
    index: false, // 🚫 jangan diindeks Google
    follow: false, // 🚫 jangan ikuti link di halaman ini
  },
}
