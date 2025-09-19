// app/admin/blog/page.tsx
import BlogList from "../../../blog/components/BlogList"
import Link from "next/link"
import React from "react"

export default function BlogPage() {
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3">My Blogs</h1>
        <Link href="/admin/blog/new" className="btn btn-primary">+ New Blog</Link>
      </div>
      <BlogList />
    </div>
  )
}
