"use client"

import React from "react"
import { useParams } from "next/navigation"
import AddMembershipForm from "./AddMembershipForm"
import { useMemberships } from "../hooks/useMemberships"
import BlogRoleSelect from "./BlogRoleSelect"
import { request } from "../../lib/allauth"

function RoleBadge({ role }: { role: string }) {
  const colors: Record<string, string> = {
    admin: "badge bg-danger",
    editor: "badge bg-primary",
    author: "badge bg-success",
    reader: "badge bg-secondary",
  }
  return <span className={colors[role] || "badge bg-light"}>{role}</span>
}

export default function MembershipTable() {
  const { id } = useParams()
  const blogId = id as string
  const { memberships, isLoading, isError, mutate } = useMemberships(blogId)

  async function handleRoleChange(membershipId: number, newRole: string) {
    await request("PATCH", `/blog/memberships/${membershipId}/`, { role: newRole })
    mutate()
  }

  async function handleRemove(membershipId: number) {
    await request("DELETE", `/blog/memberships/${membershipId}/`)
    mutate()
  }

  if (isLoading) return <p>Loading memberships...</p>
  if (isError) return <p className="text-danger">Gagal memuat membership</p>

  return (
    <div>
      <AddMembershipForm blogId={blogId} onAdded={mutate} />

      <table className="table table-hover mt-3">
        <thead className="table-light">
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Added At</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {memberships.map((m) => (
            <tr key={m.id}>
              <td>{m.user_email}</td>
              <td>
                <RoleBadge role={m.role} />
              </td>
              <td>{new Date(m.added_at).toLocaleString("id-ID", {
                dateStyle: "medium",
                timeStyle: "short",
              })}</td>
              <td>
                <div className="d-flex gap-2">
                  <BlogRoleSelect
                    value={m.role}
                    onChange={(val) => handleRoleChange(m.id, val)}
                  />
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleRemove(m.id)}
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
