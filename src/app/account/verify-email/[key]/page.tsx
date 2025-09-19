// app/account/verify-email/[key]/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AuthResponse, getEmailVerification, verifyEmail } from '../../../../lib/allauth'
import Button from '../../../../components/Button'

type Status = 'pending' | 'success' | 'error'

export default function VerifyEmailPage() {
  const params = useParams()
  const router = useRouter()

  const rawKey = Array.isArray(params.key) ? params.key[0] : params.key
  const key = typeof rawKey === 'string' ? decodeURIComponent(rawKey) : ''

  const [verification, setVerification] = useState<AuthResponse | null>(null)
  const [status, setStatus] = useState<Status>('pending')
  const [message, setMessage] = useState('')
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    console.log(`load key ${key}`)
    if (!key || key.length < 8) {
      setVerification({ status: 400, data: {} })
      return
    }

    getEmailVerification(key)
      .then((resp) => {
        setVerification(resp)
      })
      .catch((e: unknown) => {
        const error = e as { status?: number }
        console.error('Gagal memuat informasi verifikasi:', error)
        // Hanya log error selain 400 dan 404
        if (error?.status && ![400, 404].includes(error.status)) {
          console.error('Gagal memuat informasi verifikasi:', error)
        }

        setVerification({ status: error?.status || 400, data: {} })
      })
  }, [key])


  const submit = async () => {
    setFetching(true)
    try {
      const res = await verifyEmail(key)
      if (res?.status === 200 || res?.status === 401) {
        setStatus('success')
        setMessage('Email berhasil diverifikasi!')
        setTimeout(() => router.push('/account/email'), 2000)
      } else {
        const errList = Array.isArray(res?.data?.errors) ? res.data.errors : []
        const reason =
          errList.length > 0
            ? `${errList[0].message} (kode: ${errList[0].code})`
            : res?.data?.detail || `Status ${res?.status || '??'}`

        setStatus('error')
        setMessage(`Gagal memverifikasi email: ${reason}`)

        // Hanya log kesalahan berat
        if (!res?.status || res.status >= 500) {
          console.error('Detail error:', res)
        }
      }
    } catch (e) {
      if (e.status === 401) {
        setStatus('success')
        setMessage('Email berhasil diverifikasi!')
        setTimeout(() => router.push('/account/email'), 2000)
      }
      else {
        console.error('Exception saat verifikasi:', e)
        setStatus('error')
        setMessage('Terjadi kesalahan saat memverifikasi email.')
      }
    } finally {
      setFetching(false)
    }
  }

  if (!verification) {
    return (
      <div className="container mt-5">
        <p>Memuat informasi verifikasi email...</p>
      </div>
    )
  }

  const data = verification.data

  return (
    <div className="container mt-5">
      <h1>Verifikasi Email</h1>

      {status === 'success' && (
        <div className="alert alert-success" role="alert">
          {message}
        </div>
      )}

      {status === 'error' && (
        <div className="alert alert-danger" role="alert">
          {message}
          <br />
          <Button className="mt-3" onClick={() => router.replace('/account/email')}>
            Kembali ke Pengaturan Email
          </Button>
        </div>
      )}

      {status === 'pending' && verification.status === 200 && (
        <>
          <p>
            Konfirmasi bahwa{' '}
            <a href={`mailto:${String(data?.email)}`}>{String(data?.email)}</a> adalah email milik{' '}
            <strong>{String((data?.user as Record<string, unknown>)?.str ?? 'pengguna ini')}</strong>.
          </p>
          <Button onClick={submit} disabled={fetching}>
            {fetching ? 'Memverifikasi...' : 'Verifikasi Email'}
          </Button>
        </>
      )}

      {status === 'pending' && verification.status !== 200 && (
        <div className="alert alert-warning" role="alert">
          Link verifikasi tidak valid atau email sudah diverifikasi sebelumnya.
        </div>
      )}
    </div>
  )
}
