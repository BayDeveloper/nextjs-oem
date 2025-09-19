// app/admin/blog/[id]/[slug]/edit/page.tsx
"use client"

import React from "react"
import useSWR from "swr"
import { useParams, useRouter } from "next/navigation"
import BlogForm from "../../../../../../blog/components/BlogForm"
import { request } from "../../../../../../lib/allauth"
import type { Blog } from "../../../../../../blog/types"

export default function EditBlogPage() {
  const router = useRouter()
  const { id, slug } = useParams()
  const blogId = id as string
  const bSlug = slug as string

  const { data, error, isLoading } = useSWR<Blog>(
    blogId ? `/blog/blogs/${blogId}/` : null,
    (url: string) => request<Blog>("GET", url)
  )

  async function handleDelete() {
    if (!confirm("Yakin hapus blog ini? Aksi tidak bisa dibatalkan.")) return
    await request("DELETE", `/blog/blogs/${blogId}/`)
    router.push("/admin/blog")
  }

  if (isLoading) return <div className="container py-4">Loading...</div>
  if (error) return <div className="container py-4">Gagal memuat data.</div>
  if (!data) return null

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3">Edit Blog</h1>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-danger" onClick={handleDelete}>
            Delete
          </button>
          <a href={`/admin/blog/${blogId}/${bSlug}`} className="btn btn-outline-secondary">Back</a>
        </div>
      </div>

      <BlogForm
        initial={data}
        method="PATCH"
        onSuccess={(blog) => router.push(`/admin/blog/${blog.id}/${blog.slug}`)}
      />
    </div>
  )
}
