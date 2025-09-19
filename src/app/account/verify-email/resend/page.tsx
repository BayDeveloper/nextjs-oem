// app/account/verify-email/resend/page.tsx
'use client'

import React, { useState } from 'react'
import { useAuth } from '../../../../auth/AuthContext'
import { ClientOnly } from '../../../../lib/helpers/ClientOnly'
import { useRequest } from '../../../../lib/helpers/useRequest'
import { sendEmailVerification } from '../../../../lib/allauth'

function ResendEmailVerificationPage() {
  const { user } = useAuth()
  const [success, setSuccess] = useState<string | null>(null)
  const [httpStatus, setHttpStatus] = useState<number | null>(null)

  const initialEmail = typeof user?.email === 'string' ? user.email : ''
  const [email, setEmail] = useState<string>(initialEmail)

  const { trigger: resendEmail, error, loading } = useRequest(sendEmailVerification)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(null)
    setHttpStatus(null)

    try {
      const resp = await resendEmail({ email })
      if (resp?.status === 200) {
        setSuccess('Email verifikasi telah dikirim. Silakan periksa kotak masuk Anda.')
      }
    } catch (err: any) {
      setHttpStatus(err?.status ?? null)
    }
  }

  return (
    <div className="container mt-5" style={{ maxWidth: 500 }}>
      <h2 className="mb-4">Kirim Ulang Verifikasi Email</h2>

      {success && <div className="alert alert-success">{success}</div>}
      {httpStatus === 403 && (
        <div className="alert alert-warning">
          Terlalu banyak permintaan. Silakan coba lagi nanti.
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
        {initialEmail ? (
          <p>
            Email Anda: <strong>{initialEmail}</strong>
          </p>
        ) : (
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
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
        )}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Mengirim…' : 'Kirim Verifikasi'}
        </button>
      </form>
    </div>
  )
}

export default function ResendWrapper() {
  return (
    <ClientOnly>
      <ResendEmailVerificationPage />
    </ClientOnly>
  )
}
