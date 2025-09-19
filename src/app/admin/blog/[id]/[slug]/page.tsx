// app/admin/blog/[id]/[slug]/page.tsx
"use client"

import { useParams } from "next/navigation"
import PostList from "../../../../../blog/components/PostList"
import React from "react"
import Link from "next/link"

export default function BlogDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const slug = params?.slug as string

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-3">Blog Detail: {slug}</h1>
        <Link href={`/admin/blog`} className="btn btn-outline-secondary">
          ← Back to Blog
        </Link>
      </div>
      <PostList blogId={id} slug={slug} />
    </div>
  )
}
