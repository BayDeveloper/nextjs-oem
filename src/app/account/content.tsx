// src/app/account/content.tsx
'use client'

import React from 'react'
import { useAuth } from '../../auth/AuthContext'
import { useLogout } from '../../auth/useLogout'

export function AccountContent() {
  const { user, loading } = useAuth()
  const { triggerLogout } = useLogout()

  if (loading) {
    return <p className="container mt-5 text-center">⏳ Memuat data akun…</p>
  }
  if (!user) {
    return (
      <p className="container mt-5 text-center text-danger">
        ❌ Gagal memuat akun.
      </p>
    )
  }

  // ✅ casting aman tanpa interface
  const id = String(user.id ?? '')
  const email = String(user.email ?? '')
  const display = String(user.display ?? email ?? 'Pengguna')
  const role = String(user.role ?? '')
  const hasPassword = Boolean(user.has_usable_password)

  return (
    <div className="container mt-5">
      <h2 className="mb-3">👋 Halo, {display}!</h2>
      <p>Selamat datang di dashboard akun Anda.</p>

      <div className="mt-4">
        <h5 className="mb-3">📌 Informasi Akun</h5>
        <ul className="list-group mb-4">
          <li className="list-group-item">
            <strong>ID:</strong> {id}
          </li>
          <li className="list-group-item">
            <strong>Email:</strong> {email}
          </li>
          {role && (
            <li className="list-group-item">
              <strong>Role:</strong> {role}
            </li>
          )}
          <li className="list-group-item">
            <strong>Password aktif:</strong> {hasPassword ? '✅ Ya' : '❌ Tidak'}
          </li>
        </ul>
      </div>

      <button
        onClick={triggerLogout}
        className="btn btn-outline-danger"
      >
        🚪 Logout
      </button>
    </div>
  )
}
