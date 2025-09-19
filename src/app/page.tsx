// src/app/page.tsx
import type { Metadata } from "next"
import HomeClient from "./HomeClient"
import React from "react"

export const metadata: Metadata = {
  title: "OEM-X Blog | Artikel Terbaru",
  description: "Kumpulan artikel terbaru dari semua blog di OEM-X.",
  openGraph: {
    title: "OEM-X Blog | Artikel Terbaru",
    description: "Kumpulan artikel terbaru dari semua blog di OEM-X.",
    url: "https://oem-x.my.id/",
    type: "website",
    images: [
      {
        url: "https://oem-x.my.id/next.svg",
        width: 1200,
        height: 630,
        alt: "OEM-X Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OEM-X Blog | Artikel Terbaru",
    description: "Kumpulan artikel terbaru dari semua blog di OEM-X.",
    images: ["https://oem-x.my.id/next.svg"],
  },
}

export default function HomePage() {
  return <HomeClient />
}
