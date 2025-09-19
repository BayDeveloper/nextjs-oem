// blog/components/BlogForm.tsx
"use client"

import React, { useState } from "react"
import { request } from "../../lib/allauth"
import type { Blog } from "../types"

type Props = {
  initial?: Partial<Blog>
  onSuccess?: (blog: Blog) => void
  method?: "POST" | "PATCH" | "PUT"
}

export default function BlogForm({ initial, onSuccess, method }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "")
  const [description, setDescription] = useState(initial?.description ?? "")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      let blog: Blog
      if (initial?.id) {
        blog = await request<Blog>(
          method ?? "PATCH",
          `/blog/blogs/${initial.id}/`,
          { title, description }
        )
      } else {
        blog = await request<Blog>(
          "POST",
          "/blog/blogs/",
          { title, description }
        )
      }
      onSuccess?.(blog)
    } catch (err: any) {
      const msg = err?.detail || err?.message || "Gagal menyimpan blog."
      setError(typeof msg === "string" ? msg : JSON.stringify(msg))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="card-body">
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={255}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="d-flex gap-2">
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Save"}
          </button>
          {initial?.id && (
            <a href={`/admin/blog/${initial.id}/${initial.slug}/`} className="btn btn-outline-secondary">
              Cancel
            </a>
          )}
        </div>
      </div>
    </form>
  )
}
