"use client"

import { useState } from "react"
import useSWR from "swr"
import { request } from "../../../../lib/allauth"
import React from "react"

interface User {
  id: number
  email: string
  role: string
  is_active: boolean
  is_staff: boolean
  is_superuser: boolean
}

export default function UserPermissionPage() {
  const { data: users, mutate } = useSWR<User[]>("/accounts/user-status/", url =>
    request<User[]>("GET", url)
  )
  const [saving, setSaving] = useState<number | null>(null)

  if (!users) return <div>Loading...</div>

  async function toggleFlag(user: User, field: keyof User) {
    setSaving(user.id)
    await request("PATCH", `/accounts/user-status/${user.id}/`, {
      [field]: !user[field],
    })
    await mutate()
    setSaving(null)
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">User Status Management</h1>
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Active</th>
              <th>Staff</th>
              <th>Superuser</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td className="text-center">
                  <input
                    type="checkbox"
                    checked={u.is_active}
                    disabled={saving === u.id}
                    onChange={() => toggleFlag(u, "is_active")}
                  />
                </td>
                <td className="text-center">
                  <input
                    type="checkbox"
                    checked={u.is_staff}
                    disabled={saving === u.id}
                    onChange={() => toggleFlag(u, "is_staff")}
                  />
                </td>
                <td className="text-center">
                  <input
                    type="checkbox"
                    checked={u.is_superuser}
                    disabled={saving === u.id}
                    onChange={() => toggleFlag(u, "is_superuser")}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
