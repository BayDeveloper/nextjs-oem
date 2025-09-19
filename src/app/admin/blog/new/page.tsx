// app/admin/blog/new/page.tsx
"use client"

import React from "react"
import { useRouter } from "next/navigation"
import BlogForm from "../../../../blog/components/BlogForm"
import type { Blog } from "../../../../blog/types"

export default function NewBlogPage() {
  const router = useRouter()
  return (
    <div className="container py-4">
      <h1 className="h3 mb-3">Create Blog</h1>
      <BlogForm onSuccess={(blog: Blog) => router.push(`/admin/blog/${blog.id}/${blog.slug}`)} />
    </div>
  )
}
