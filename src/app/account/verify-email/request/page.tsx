// app/account/verify-email/request/page.tsx
'use client'

import React, { useState } from 'react'
import { ClientOnly } from '../../../../lib/helpers/ClientOnly'
import { useRequest } from '../../../../lib/helpers/useRequest'
import { requestEmailVerificationUnauthenticated } from '../../../../lib/allauth'

function RequestEmailVerificationPage() {
  const [email, setEmail] = useState<string>('')
  const [success, setSuccess] = useState<string | null>(null)
  const [httpStatus, setHttpStatus] = useState<number | null>(null)

  const { trigger: sendRequest, error, loading } = useRequest(requestEmailVerificationUnauthenticated)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(null)
    setHttpStatus(null)

    try {
      const resp = await sendRequest({ email })
      if (resp?.status === 200) {
        setSuccess('Email verifikasi telah dikirim. Silakan periksa kotak masuk Anda.')
      }
    } catch (err: any) {
      setHttpStatus(err?.status ?? null)
    }
  }

  return (
    <div className="container mt-5" style={{ maxWidth: 500 }}>
      <h2 className="mb-4">Permintaan Verifikasi Email</h2>

      {success && <div className="alert alert-success">{success}</div>}

      {httpStatus === 403 && (
        <div className="alert alert-warning">
          Terlalu banyak permintaan. Coba lagi nanti.
        </div>
      )}

      {httpStatus === 400 && (
        <div className="alert alert-danger">
          Email tidak valid atau tidak ditemukan.
        </div>
      )}

      {httpStatus !== 400 && httpStatus !== 403 && error && (
        <div className="alert alert-danger">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Alamat Email</label>
          <input
            id="email"
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Mengirim…' : 'Kirim Verifikasi'}
        </button>
      </form>
    </div>
  )
}

export default function RequestWrapper() {
  return (
    <ClientOnly>
      <RequestEmailVerificationPage />
    </ClientOnly>
  )
}
