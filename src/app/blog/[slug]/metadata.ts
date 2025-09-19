// app/blog/[slug]/metadata.ts
import type { Metadata } from "next"

export const blogDetailMetadata: Metadata = {
  title: "Detail Blog | OEM-X",
  description: "Artikel dan konten dari blog tertentu di OEM-X.",
  robots: {
    index: true,  // ✅ default diindeks, nanti bisa override di generateMetadata()
    follow: true,
  },
}
