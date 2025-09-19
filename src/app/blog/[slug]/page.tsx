// app/blog/[slug]/page.tsx
import React from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { request } from "../../../lib/allauth"
import { renderPlainNode } from "../../../components/wysiwyg/renderers"
import { Descendant } from "slate"
import type { Metadata } from "next"

export default async function BlogPublicPage(
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params

  const res = await request<any>("GET", `/blog/public/posts/?blog=${slug}`)
  const posts = Array.isArray(res) ? res : res?.results ?? []

  if (!posts || posts.length === 0) {
    notFound() // 🚫 auto redirect ke app/blog/not-found.tsx
  }

  return (
    <div className="container py-5" style={{ maxWidth: "1000px" }}>
      <h1 className="display-6 fw-bold mb-4 text-center">Blog: {slug}</h1>
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
                      href={`/blog/${slug}/${p.slug}`}
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

// ✅ Metadata SEO
export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params

  let posts: any[] = []
  try {
    const res = await request<any>("GET", `/blog/public/posts/?blog=${slug}`)
    posts = Array.isArray(res) ? res : res?.results ?? []
  } catch {
    posts = []
  }

  if (!posts || posts.length === 0) {
    // ❌ noindex di sini dihapus → ditangani oleh not-found.tsx
    return {}
  }

  const latest = posts[0]
  const title = `Blog ${slug} | OEM-X`
  const description =
    latest?.content
      ? (typeof latest.content === "string"
        ? JSON.parse(latest.content)
        : latest.content
      )
        .map((node: any) => ("text" in node ? node.text : ""))
        .join(" ")
        .slice(0, 150)
      : `Kumpulan artikel terbaru dari blog ${slug}.`

  const image = "https://oem-x.my.id/next.svg"

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://oem-x.my.id/blog/${slug}`,
      images: [{ url: image, width: 1200, height: 630, alt: "OEM-X Blog" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  }
}
