// src/app/blog/home/page.tsx
import React from "react"
import Link from "next/link"
import { request } from "../../../lib/allauth"
import { renderPlainNode } from "../../../components/wysiwyg/renderers"
import { Descendant } from "slate"
import type { Metadata } from "next"

export default async function BlogIndexPage() {
  const res = await request<any>("GET", "/blog/public/posts/")
  const posts = Array.isArray(res) ? res : res?.results ?? []

  if (!posts || posts.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h1 className="h3 mb-3">Beranda Blog</h1>
        <p className="text-muted">Belum ada posting yang dipublikasikan.</p>
      </div>
    )
  }

  return (
    <div className="container py-5" style={{ maxWidth: "1000px" }}>
      <h1 className="display-6 fw-bold mb-4 text-center">Semua Artikel Terbaru</h1>
      <div className="row g-4">
        {posts.map((p: any) => {
          const content: Descendant[] =
            typeof p.content === "string" ? JSON.parse(p.content) : p.content
          const excerptNodes = content.slice(0, 2)

          return (
            <div className="col-md-6 col-lg-4" key={p.id}>
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">
                    <Link
                      href={`/blog/${p.blog}/${p.slug}`}
                      className="stretched-link text-decoration-none text-dark"
                    >
                      {p.title}
                    </Link>
                  </h5>
                  <p className="card-subtitle mb-2 text-muted small">
                    {new Date(p.published_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <div
                    className="card-text text-truncate"
                    style={{ maxHeight: "4.5rem", overflow: "hidden" }}
                  >
                    {excerptNodes.map((node, i) => renderPlainNode(node, i))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ✅ SEO Metadata
export const metadata: Metadata = {
  title: "Beranda Blog | OEM-X",
  description: "Kumpulan semua artikel terbaru dari berbagai blog di OEM-X.",
  openGraph: {
    title: "Beranda Blog | OEM-X",
    description: "Kumpulan semua artikel terbaru dari berbagai blog di OEM-X.",
    type: "website",
    url: "https://oem-x.my.id/blog/home",
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
