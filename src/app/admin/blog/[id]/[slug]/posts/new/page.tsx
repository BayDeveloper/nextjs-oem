// app/admin/blog/[id]/[slug]/posts/new/page.tsx
"use client"

import React from "react"
import { useRouter, useParams } from "next/navigation"
import PostForm from "../../../../../../../blog/components/PostForm"
import type { Post } from "../../../../../../../blog/types"

export default function NewPostPage() {
  const { id, slug } = useParams()
  const blogId = id as string
  const bSlug = slug as string
  const router = useRouter()

  return (
    <div className="container py-4">
      <h5 className="h6 mb-2">Blog Detail: {bSlug}</h5>
      <h1 className="h3 mb-3">Create Post</h1>
      <PostForm
        blogId={blogId}
        bSlug={bSlug}
        onSuccess={(post: Post) => router.push(`/admin/blog/${blogId}/${bSlug}/posts/${post.id}`)}
      />
    </div>
  )
}
