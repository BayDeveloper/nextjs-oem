// app/blog/page.tsx
import React from "react"
import Link from "next/link"
import type { Metadata } from "next"
import { request } from "../../lib/allauth"

export default async function BlogListPage() {
  const res = await request<any>("GET", "/blog/public/blogs/")
  const blogs = Array.isArray(res) ? res : res?.results ?? []

  if (!blogs || blogs.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h1 className="h3 mb-3">Daftar Blog</h1>
        <p className="text-muted">Belum ada blog yang tersedia.</p>
      </div>
    )
  }

  return (
    <div className="container py-5" style={{ maxWidth: "1000px" }}>
      <h1 className="display-6 fw-bold mb-4 text-center">Daftar Blog</h1>
      <div className="row g-4">
        {blogs.map((b: any) => (
          <div className="col-md-6 col-lg-4" key={b.id}>
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title mb-2">
                  <Link
                    href={`/blog/${b.slug}`}
                    className="stretched-link text-decoration-none text-dark"
                  >
                    {b.title}
                  </Link>
                </h5>
                {b.description && (
                  <p className="card-text text-muted small">
                    {b.description.length > 120
                      ? b.description.slice(0, 120) + "..."
                      : b.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ✅ Tambahan Metadata untuk SEO
export async function generateMetadata(): Promise<Metadata> {
  let blogs: any[] = []
  try {
    const res = await request<any>("GET", "/blog/public/blogs/")
    blogs = Array.isArray(res) ? res : res?.results ?? []
  } catch {
    blogs = []
  }

  const latest = blogs[0]

  return {
    title: "Daftar Blog | OEM-X",
    description:
      latest?.description?.slice(0, 150) ||
      "Jelajahi kumpulan blog publik di OEM-X. Temukan artikel terbaru yang dipublikasikan.",
    openGraph: {
      title: "Daftar Blog | OEM-X",
      description:
        latest?.description?.slice(0, 150) ||
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
}
