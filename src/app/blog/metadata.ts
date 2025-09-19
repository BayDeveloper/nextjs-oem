// app/blog/metadata.ts
import type { Metadata } from "next"

export const blogMetadata: Metadata = {
  title: "Blog | OEM-X",
  description:
    "Jelajahi kumpulan blog publik di OEM-X. Temukan artikel terbaru yang dipublikasikan.",
  robots: {
    index: true,  // ✅ blog publik boleh diindeks
    follow: true,
  },
  openGraph: {
    title: "Blog | OEM-X",
    description:
      "Jelajahi kumpulan blog publik di OEM-X. Temukan artikel terbaru yang dipublikasikan.",
    type: "website",
    url: "https://oem-x.my.id/blog",
    images: [
      {
        url: "https://oem-x.my.id/next.svg",
        width: 1200,
        height: 630,
        alt: "OEM-X Blog",
      },
    ],
  },
}
