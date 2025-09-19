// blog/components/PostList.tsx
"use client"

import Link from "next/link"
import { usePosts } from "../hooks/usePosts"
import { request } from "../../lib/allauth"
import React from "react"

interface PostListProps {
  blogId: string,
  slug: string
}

export default function PostList({ blogId, slug }: PostListProps) {
  const { posts, isLoading, isError, mutate } = usePosts(blogId)

  async function handleDelete(postId: number) {
    await request("DELETE", `/blog/posts/${postId}/`)
    mutate()
  }

  if (isLoading) return <p>Loading posts...</p>
  if (isError) return <p>Gagal memuat posts</p>

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h4">Posts</h2>
        <Link href={`/admin/blog/${blogId}/${slug}/posts/new`} className="btn btn-primary btn-sm">
          + New Post
        </Link>
      </div>

      {!posts || posts.length === 0 ? (
        <p className="text-muted">Belum ada post.</p>
      ) : (
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Judul</th>
              <th>Author</th>
              <th>Status</th>
              <th>Dibuat</th>
              <th style={{ width: "180px" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {(posts ?? []).map((p) => (
              <tr key={p.id}>
                <td>
                  <Link
                    href={`/admin/blog/${blogId}/${slug}/posts/${p.id}`}
                    className="text-decoration-none"
                  >
                    {p.title}
                  </Link>
                </td>
                <td>{p.author_email}</td>
                <td>
                  {p.published ? (
                    <span className="badge bg-success">Published</span>
                  ) : (
                    <span className="badge bg-secondary">Draft</span>
                  )}
                </td>
                <td>{new Date(p.created_at).toLocaleString("id-ID")}</td>
                <td>
                  <div className="btn-group btn-group-sm" role="group">
                    <Link
                      href={`/admin/blog/${blogId}/${slug}/posts/${p.id}/view`}
                      className="btn btn-outline-secondary"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/blog/${blogId}/${slug}/posts/${p.id}`}
                      className="btn btn-outline-primary"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => handleDelete(p.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
