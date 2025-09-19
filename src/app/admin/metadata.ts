// app/admin/metadata.ts
import type { Metadata } from "next"

export const adminMetadata: Metadata = {
  title: "Admin | OEM-X",
  description: "Halaman admin OEM-X.",
  robots: { index: false, follow: false }, // 🚫 jangan diindeks Google
}