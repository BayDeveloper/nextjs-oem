// app/blog/not-found.tsx
import React from "react"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Blog tidak ditemukan",
  description: "Konten yang kamu cari di blog tidak tersedia.",
  robots: { index: false, follow: false }, // 🚫 noindex global untuk semua 404 blog
}

export default function BlogNotFound() {
  return (
    <div className="container py-5 text-center">
      <h1 className="display-6 fw-bold mb-3">Blog tidak ditemukan 📝</h1>
      <p className="text-muted mb-4">
        Halaman atau artikel yang kamu cari tidak tersedia.
      </p>
      <Link href="/blog" className="btn btn-outline-primary">
        ← Kembali ke Blog
      </Link>
    </div>
  )
}
