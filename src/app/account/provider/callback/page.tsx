// app/account/provider/callback/page.tsx
'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../../../auth/AuthContext'
import { getAuth, AuthResponse } from '../../../../lib/allauth'
import { pathForPendingFlow } from '../../../../auth/routing'
import { useRequest } from '../../../../lib/helpers/useRequest'
import { mutate } from 'swr'

export default function ProviderCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { flows, isAuthenticated } = useAuth()

  const [error, setError] = useState<string | null>(null)

  const { trigger: fetchAuth, loading } = useRequest(getAuth)

  const fallbackURL = useMemo(() => {
    if (isAuthenticated) return '/account'
    return pathForPendingFlow({ data: { flows } } as AuthResponse) || '/account/login'
  }, [isAuthenticated, flows])

  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      setError(decodeURIComponent(errorParam))
      return
    }

    const finalizeLogin = async () => {
      const res = await fetchAuth()
      if (!res) return setError('Gagal mengambil data sesi dari server.')

      await mutate('/auth/session')

      const flow = res.data?.flows?.find(f => f.id === 'provider_signup' && f.is_pending)
      if (flow) {
        router.replace('/account/signup')
      } else {
        router.replace(fallbackURL)
      }
    }

    finalizeLogin()
  }, [searchParams, fetchAuth, fallbackURL, router])

  if (error) {
    return (
      <div className="container mt-5">
        <h1>Login Sosial Gagal</h1>
        <div className="alert alert-danger">{error}</div>
        <Link href={fallbackURL} className="btn btn-secondary">Kembali</Link>
      </div>
    )
  }

  return (
    <div className="container mt-5">
      <h1>Menyelesaikan login…</h1>
      <p>Sedang menghubungkan akun Anda. Harap tunggu sebentar.</p>
      {loading && <p><em>Memuat data sesi…</em></p>}
    </div>
  )
}
