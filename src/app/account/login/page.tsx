// app/account/login/page.tsx
'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { mutate } from 'swr'

import { login, redirectToProvider, AuthProcess } from '../../../lib/allauth'
import { withAnonymous } from '../../../auth/AuthContext'
import { ClientOnly } from '../../../lib/helpers/ClientOnly'
import { useAuthConfig } from '../../../lib/hooks/useAuthConfig'
import type { Provider } from '../../../types'

function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/account'

  const { data: config, error: configError, isLoading: loadingConfig } = useAuthConfig()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const authMethod = config?.data?.account?.authentication_method ?? 'email'
  const isSignupOpen = config?.data?.account?.is_open_for_signup ?? true
  const socialProviders = config?.data?.socialaccount?.providers ?? []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    console.log('[Login] Mulai proses login dengan email:', email)

    try {
      const res = await login({ email, password })

      console.log('[Login] Respons login:', res)

      if (res.meta?.is_authenticated) {
        console.log('[Login] Berhasil login, redirect ke:', next)
        await mutate('/auth/session')
        router.push(next)
        return
      }

      // Jika response tidak melempar error, tapi juga tidak authenticated
      console.warn('[Login] Tidak berhasil login, response tidak melempar error tapi tidak authenticated')
      setError(res.detail || 'Login gagal.')
    } catch (e: unknown) {
      console.error('[Login] Error saat login:', e)

      if (typeof e === 'object' && e !== null && 'status' in e && 'data' in e) {
        const err = e as { status: number; data?: any }
        const flows = err.data?.data?.flows

        if (
          err.status === 401 &&
          Array.isArray(flows) &&
          flows.some((f: any) => f.id === 'verify_email' && f.is_pending)
        ) {
          console.log('[Login] Email belum diverifikasi, redirect ke /account/verify-email')
          router.push('/account/verify-email')
          return
        }

        setError(err.data?.detail || 'Login gagal.')
      } else if (e instanceof Error) {
        setError(e.message)
      } else {
        setError('Terjadi kesalahan tak dikenal.')
      }
    } finally {
      console.log('[Login] Proses login selesai.')
      setLoading(false)
    }
  }


  if (loadingConfig) {
    return <div className="container mt-5">Memuat konfigurasi login…</div>
  }
  if (configError) {
    return <div className="container mt-5 text-danger">Gagal memuat konfigurasi login.</div>
  }

  return (
    <div className="container mt-5" style={{ maxWidth: 500 }}>
      <h2 className="mb-3">Login</h2>

      {isSignupOpen && (
        <p>
          Belum punya akun? <Link href="/account/signup">Daftar di sini</Link>
        </p>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {authMethod === 'email' && (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>
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
            />
            <div className="form-text">
              <Link href="/account/password/reset">Lupa password?</Link>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>
      )}

      {socialProviders.length > 0 && (
        <div>
          <h5>Atau login dengan:</h5>
          <ul className="list-unstyled">
            {socialProviders.map((provider: Provider) => (
              <li key={provider.id} className="mb-2">
                <button
                  onClick={() =>
                    redirectToProvider(provider.id, '/account/provider/callback', AuthProcess.LOGIN)
                  }
                  className="btn btn-outline-secondary w-100"
                >
                  Login dengan {provider.name ?? provider.id}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

const LoginWithAnonymous = withAnonymous(LoginPage)
export default function LoginClientWrapper() {
  return (
    <ClientOnly>
      <LoginWithAnonymous />
    </ClientOnly>
  )
}
