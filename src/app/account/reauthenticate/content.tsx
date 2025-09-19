'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { reauthenticate } from '../../../lib/allauth'
import { useRequest } from '../../../lib/helpers/useRequest'
import { mutate } from 'swr'

export function ReauthenticateContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/'

  const [password, setPassword] = useState('')
  const { trigger: doReauth, error, loading } = useRequest(reauthenticate)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const resp = await doReauth({ password })

    if (!resp?.meta?.is_authenticated) return

    // Revalidasi session auth agar fresh
    await mutate('/auth/session')

    // Redirect ke tujuan semula
    router.replace(next)
  }

  return (
    <div className="container mt-5" style={{ maxWidth: 480 }}>
      <h2>Verifikasi Ulang</h2>
      <p>
        Demi keamanan, masukkan ulang password Anda untuk melanjutkan.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            id="password"
            type="password"
            className="form-control"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
            required
            autoComplete="current-password"
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button type="submit" className="btn btn-primary" disabled={loading || !password}>
          {loading ? 'Memverifikasi...' : 'Lanjutkan'}
        </button>
      </form>
    </div>
  )
}
