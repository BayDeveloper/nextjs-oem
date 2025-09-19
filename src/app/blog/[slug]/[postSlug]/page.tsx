// src/app/blog/[slug]/[postSlug]/page.tsx
import React from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { request } from "../../../../lib/allauth"
import { ImageViewer } from "../../../../components/wysiwyg/ImageViewer"
import { Descendant, Text } from "slate"

// ----- Utility untuk render read-only Slate content -----
function renderNode(node: Descendant, key: number, fallbackAlt?: string): React.ReactNode {
  // Text node
  if (Text.isText(node)) {
    let children: React.ReactNode = node.text
    if (node.bold) children = <strong>{children}</strong>
    if (node.italic) children = <em>{children}</em>
    if (node.underline) children = <u>{children}</u>
    if (node.code) children = <code>{children}</code>
    return <span key={key}>{children}</span>
  }

  // Children
  const children = node.children.map((n, i) => renderNode(n, i, fallbackAlt))

  // Style align
  const style: React.CSSProperties = {}
  if ("align" in node && node.align) style.textAlign = node.align as any

  // Element types
  switch (node.type) {
    case "heading-one":
      return <h1 key={key} style={style}>{children}</h1>
    case "heading-two":
      return <h2 key={key} style={style}>{children}</h2>
    case "block-quote":
      return <blockquote key={key} className="blockquote" style={style}>{children}</blockquote>
    case "blockquote-footer":
      return <footer key={key} className="blockquote-footer" style={style}>{children}</footer>
    case "numbered-list":
      return <ol key={key} style={style}>{children}</ol>
    case "bulleted-list":
      return <ul key={key} style={style}>{children}</ul>
    case "list-item":
      return <li key={key} style={style}>{children}</li>
    case "code-block":
      return (
        <pre key={key} style={{ ...style, background: "#f8f9fa", padding: "0.75rem", borderRadius: "0.25rem", overflowX: "auto" }}>
          <code>{children}</code>
        </pre>
      )
    case "image":
      return (
        <ImageViewer
          key={key}
          url={(node as any).url}
          alt={(node as any).alt || fallbackAlt}
          width={(node as any).width}
          height={(node as any).height}
          align={(node as any).align}
          wrap={(node as any).wrap}
        />
      )
    default:
      return <p key={key} style={style}>{children}</p>
  }
}

// Flatten Slate content untuk metadata/deskripsi
function flattenSlateText(nodes: Descendant[]): string {
  return nodes
    .map((node: any) => {
      if ("text" in node) return node.text
      if (Array.isArray(node.children)) return flattenSlateText(node.children)
      return ""
    })
    .join(" ")
    .trim()
}

// ----- Page Component -----
export default async function BlogPostPage({ params: rawParams }: any) {
  const params = await rawParams
  const { slug, postSlug } = params

  const res = await request<any>(
    "GET",
    `/blog/public/posts/?blog=${slug}&slug=${postSlug}`
  )
  const posts = Array.isArray(res) ? res : res?.results ?? []
  const post = posts[0]

  if (!post) notFound()

  const content: Descendant[] =
    post.content && typeof post.content === "string"
      ? JSON.parse(post.content)
      : Array.isArray(post.content)
        ? post.content
        : []

  return (
    <div className="container py-5" style={{ maxWidth: "900px" }}>
      <h1 className="display-5 fw-bold mb-3">{post.title}</h1>

      <div className="text-muted mb-4">
        <small>
          Dipublikasikan{" "}
          {new Date(post.published_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          oleh <strong>{post.author_email}</strong>
        </small>
      </div>

      {/* Cover Image */}
      {post.cover_image && (
        <div className="mb-4 text-center">
          <img
            src={post.cover_image}
            alt={post.title}
            className="img-fluid rounded w-100 w-xl-75 w-xxl-50"
            style={{
              maxHeight: "75vh",
              objectFit: "contain",
              backgroundColor: "#000",
              margin: "0 auto",
              display: "block",
            }}
          />
        </div>
      )}

      <article className="fs-5 lh-lg">
        {content.map((node, i) => renderNode(node, i, post.title))}
      </article>

      <hr className="my-5" />

      <div className="d-flex justify-content-between align-items-center">
        <Link href={`/blog/${slug}`} className="btn btn-outline-secondary">
          ← Kembali ke Blog
        </Link>
        <Link href={`/`} className="btn btn-outline-primary">
          🏠 Halaman Utama
        </Link>
        <div className="text-muted small">
          Bagikan artikel ini jika bermanfaat ✨
        </div>
      </div>
    </div>
  )
}

// ----- Metadata -----
export async function generateMetadata({ params: rawParams }: any) {
  const params = await rawParams
  const { slug, postSlug } = params

  const res = await request<any>(
    "GET",
    `/blog/public/posts/?blog=${slug}&slug=${postSlug}`
  )
  const posts = Array.isArray(res) ? res : res?.results ?? []
  const post = posts[0]

  if (!post) return { title: "Artikel Tidak Ditemukan" }

  const content: Descendant[] =
    post.content && typeof post.content === "string"
      ? JSON.parse(post.content)
      : Array.isArray(post.content)
        ? post.content
        : []

  const postContent = flattenSlateText(content).slice(0, 200)

  return {
    title: post.title,
    description: postContent || "Artikel di OEM-X Blog",
    alternates: { canonical: `https://oem-x.my.id/blog/${slug}/${postSlug}` },
    openGraph: {
      title: post.title,
      description: postContent || "",
      url: `https://oem-x.my.id/blog/${slug}/${postSlug}`,
      type: "article",
      images: [{ url: post.cover_image || "https://oem-x.my.id/next.svg", width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: postContent || "",
      images: [post.cover_image || "https://oem-x.my.id/next.svg"],
    },
  }
}
