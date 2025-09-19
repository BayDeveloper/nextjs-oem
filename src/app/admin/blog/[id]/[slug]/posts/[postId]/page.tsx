// app/admin/blog/[id]/[slug]/posts/[postId]/page.tsx
"use client"

import React from "react"
import { useParams, useRouter } from "next/navigation"
import useSWR from "swr"
import PostForm from "../../../../../../../blog/components/PostForm"
import { request } from "../../../../../../../lib/allauth"
import type { Post } from "../../../../../../../blog/types"

export default function EditPostPage() {
  const { id, slug, postId } = useParams()
  const blogId = id as string
  const bSlug = slug as string
  const router = useRouter()

  const { data, error, isLoading } = useSWR<Post>(
    postId ? `/blog/posts/${postId}/` : null,
    (url: string) => request<Post>("GET", url)
  )

  async function handleDelete() {
    if (!confirm("Yakin hapus post ini?")) return
    await request("DELETE", `/blog/posts/${postId}/`)
    router.push(`/blog/${blogId}/${bSlug}`)
  }

  if (isLoading) return <div className="container py-4">Loading...</div>
  if (error) return <div className="container py-4">Gagal memuat data.</div>
  if (!data) return null

  return (
    <div className="container py-4">
      <h5 className="h6 mb-2">Blog Detail: {bSlug}</h5>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3">Edit Post</h1>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-danger" onClick={handleDelete}>
            Delete
          </button>
          <a href={`/admin/blog/${blogId}/${bSlug}`} className="btn btn-outline-secondary">Back</a>
        </div>
      </div>

      <PostForm
        blogId={blogId}
        bSlug={bSlug}
        initial={data}
        method="PATCH"
        onSuccess={(post) => router.push(`/admin/blog/${blogId}/${bSlug}/posts/${post.id}`)}
      />
    </div>
  )
}
