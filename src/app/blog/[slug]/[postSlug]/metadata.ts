// app/blog/[slug]/[postSlug]/metadata.ts
import type { Metadata } from "next"

export const blogPostMetadata: Metadata = {
  title: "Artikel Blog | OEM-X",
  description: "Baca artikel menarik di OEM-X Blog.",
  robots: {
    index: true,  // ✅ default diindeks, kalau post not found → generateMetadata override ke noindex
    follow: true,
  },
}
