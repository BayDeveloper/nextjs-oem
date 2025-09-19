// blog/components/BlogList.tsx
"use client"

import React from "react"
import Link from "next/link"
import { useBlogs } from "../hooks/useBlogs"

export default function BlogList() {
  const { blogs, isLoading, isError } = useBlogs()

  if (isLoading) return <p>Loading blogs...</p>
  if (isError) return <p>Gagal memuat blogs</p>

  return (
    <div>
      <h2 className="h4 mb-3">Blogs</h2>
      <ul className="list-group">
        {blogs.map((b) => (
          // di dalam <li> pada BlogList
          <li key={b.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <Link href={`/admin/blog/${b.id}/${b.slug}`}>{b.title} | {b.slug}</Link>
              <span className="text-muted ms-2">Owner: {b.owner_email}</span>
            </div>
            <div className="btn-group">
              <Link href={`/admin/blog/${b.id}/${b.slug}/memberships`} className="btn btn-sm btn-outline-secondary">Members</Link>
              <Link href={`/admin/blog/${b.id}/${b.slug}/edit`} className="btn btn-sm btn-outline-primary">Edit</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
