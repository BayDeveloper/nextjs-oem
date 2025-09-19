"use client"

import { useUsers } from "../../hooks/useUsers"
import { request } from "../../../../lib/allauth"
import { useState } from "react"
import React from "react"

const roles = ["customer", "staff", "manager", "admin"]

export default function UserListPage() {
  const { users, isLoading, isError, mutate } = useUsers()
  const [savingId, setSavingId] = useState<number | null>(null)

  if (isError) return <div className="alert alert-danger">Gagal memuat user.</div>
  if (isLoading) return <div className="text-center p-4">Memuat...</div>

  async function handleRoleChange(userId: number, newRole: string) {
    setSavingId(userId)
    try {
      await request("PATCH", `/accounts/users-roles/${userId}/`, { role: newRole })
      await mutate() // refresh list user
    } catch (err: any) {
      console.error("Gagal update role:", err)
      alert(err?.data?.detail || "Gagal mengubah role")
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">User Roles Management</h1>
      <table className="table table-bordered align-middle">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Role</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>
                <select
                  className="form-select"
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  disabled={savingId === user.id}
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                {savingId === user.id ? (
                  <span className="text-muted">Menyimpan...</span>
                ) : (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleRoleChange(user.id, user.role)}
                  >
                    Simpan
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
