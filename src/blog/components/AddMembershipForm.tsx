// blog/components/AddMembershipForm.tsx
"use client"

import React, { useState } from "react"
import { request } from "../../lib/allauth"

export default function AddMembershipForm({ blogId, onAdded }: { blogId: string, onAdded: () => void }) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("author")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await request("POST", "/blog/memberships/add_by_email/", { blog: blogId, email: email, role })
      setEmail("")
      setRole("author")
      onAdded() // refresh memberships
    } catch (err: any) {
      setError(err?.data?.detail || "Gagal menambah member")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="d-flex gap-2 mb-3">
      <input
        type="email"
        className="form-control"
        placeholder="Email member"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="author">Author</option>
        <option value="editor">Editor</option>
        <option value="admin">Admin</option>
      </select>
      <button className="btn btn-primary" disabled={loading}>
        {loading ? "Adding..." : "Add"}
      </button>
      {error && <div className="text-danger">{error}</div>}
    </form>
  )
}
