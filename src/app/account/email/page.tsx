// app/account/email/page.tsx
'use client'

import React, { useState, useMemo } from 'react'
import { withAuth, useConfig } from '../../../auth/AuthContext'
import {
  addEmail,
  deleteEmail,
  markEmailAsPrimary,
  requestEmailVerification,
  EmailAddress
} from '../../../lib/allauth'
import { useRequest } from '../../../lib/helpers/useRequest'
import Button from '../../../components/Button'
import { useRouter } from 'next/navigation'
import { ClientOnly } from '../../../lib/helpers/ClientOnly'
import { useEmailAddresses } from '../../../lib/hooks/useEmailAddresses'

function ChangeEmailPage() {
  const config = useConfig()
  const router = useRouter()
  const [email, setEmail] = useState('')

  const { data, isLoading: loadingEmails, mutate } = useEmailAddresses()
  const emails: EmailAddress[] = data?.data ?? []

  const { trigger: add, loading: adding, error: addError } = useRequest(addEmail)
  const { trigger: resend, loading: resending } = useRequest(requestEmailVerification)
  const { trigger: del, loading: deleting } = useRequest(deleteEmail)
  const { trigger: setPrimary, loading: patching } = useRequest(markEmailAsPrimary)

  const isBusy = useMemo(() => adding || resending || deleting || patching, [
    adding, resending, deleting, patching
  ])

  const handleAdd = async () => {
    const res = await add(email)
    if (res?.status === 200) {
      mutate() // reload email list
      setEmail('')
      if (config?.account?.email_verification_by_code_enabled) {
        router.replace('/account/verify-email')
      }
    }
  }

  const handleVerify = async (email: string) => {
    const res = await resend(email)
    if (res?.status === 200 && config?.account?.email_verification_by_code_enabled) {
      router.replace('/account/verify-email')
    }
  }

  const handleDelete = async (email: string) => {
    const res = await del(email)
    if (res?.status === 200) {
      mutate()
    }
  }

  const handleSetPrimary = async (email: string) => {
    const res = await setPrimary(email)
    if (res?.status === 200) {
      mutate()
    }
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Kelola Email</h2>

      {loadingEmails ? (
        <p>Sedang memuat daftar email...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Email</th>
                <th>Terverifikasi</th>
                <th>Utama</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {emails.map((ea) => (
                <tr key={ea.email}>
                  <td>{ea.email}</td>
                  <td>{ea.verified ? '✅' : '❌'}</td>
                  <td>
                    <input
                      type="radio"
                      onChange={() => handleSetPrimary(ea.email)}
                      checked={ea.primary}
                      disabled={isBusy}
                    />
                  </td>
                  <td>
                    {!ea.verified && (
                      <Button onClick={() => handleVerify(ea.email)} disabled={isBusy}>Resend</Button>
                    )}{' '}
                    {!ea.primary && (
                      <Button onClick={() => handleDelete(ea.email)} disabled={isBusy}>Remove</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h4 className="mt-4">Tambah Email</h4>

      {addError && <div className="alert alert-danger">{addError}</div>}

      <div className="mb-3">
        <label htmlFor="new-email" className="form-label">Email Baru</label>
        <input
          id="new-email"
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={adding}
          required
        />
      </div>

      <Button disabled={adding || !email} onClick={handleAdd}>
        Tambah
      </Button>
    </div>
  )
}

const ProtectedChangeEmail = withAuth(ChangeEmailPage)

export default function SecuredChangeEmail() {
  return (
    <ClientOnly>
      <ProtectedChangeEmail />
    </ClientOnly>
  )
}
