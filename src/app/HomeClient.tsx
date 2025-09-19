"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { request } from "../lib/allauth"
import { renderPlainNode } from "../components/wysiwyg/renderers"
import { Descendant } from "slate"

type Blog = {
  id: number
  slug: string
  title: string
}

type Post = {
  id: number
  slug: string
  title: string
  blog: string
  published_at: string
  content: string | Descendant[]
}

export default function HomeClient() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedBlog, setSelectedBlog] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await request<any>("GET", "/blog/public/blogs/")
        setBlogs(res?.results ?? res ?? [])
      } catch (e) {
        console.error("Gagal load blogs:", e)
        setBlogs([])
      }
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true)
      try {
        const url = selectedBlog
          ? `/blog/public/posts/?blog=${encodeURIComponent(selectedBlog)}`
          : "/blog/public/posts/"
        const res = await request<any>("GET", url)
        setPosts(res?.results ?? res ?? [])
      } catch (e) {
        console.error("Gagal load posts:", e)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [selectedBlog])

  return (
    <div className="container py-5" style={{ maxWidth: "1000px" }}>
      <h1 className="display-6 fw-bold mb-4 text-center">Artikel Terbaru</h1>

      <div className="mb-4 text-center">
        <select
          className="form-select w-auto d-inline-block"
          value={selectedBlog}
          onChange={(e) => setSelectedBlog(e.target.value)}
        >
          <option value="">Semua Blog</option>
          {blogs.map((b) => (
            <option key={b.id} value={b.slug}>
              {b.title}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center">Memuat posting...</div>
      ) : posts.length === 0 ? (
        <p className="text-muted text-center">Tidak ada posting.</p>
      ) : (
        <div className="row g-4">
          {posts.map((p) => {
            const content: Descendant[] =
              typeof p.content === "string" ? JSON.parse(p.content) : p.content
            const excerptNodes = content.slice(0, 2)

            return (
              <div className="col-md-6 col-lg-4" key={p.id}>
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">
                      <Link href={`/blog/${p.blog}/${p.slug}`}>
                        {p.title}
                      </Link>
                    </h5>
                    <p className="card-subtitle mb-2 text-muted small">
                      {new Date(p.published_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <div
                      className="card-text text-truncate"
                      style={{ maxHeight: "4.5rem", overflow: "hidden" }}
                    >
                      {excerptNodes.map((node, i) =>
                        renderPlainNode(node, i)
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
