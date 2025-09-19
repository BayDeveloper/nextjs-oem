// app/account/signup/page.tsx
'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { mutate } from 'swr'

import { signUp, redirectToProvider, AuthProcess } from '../../../lib/allauth'
import { withAnonymous } from '../../../auth/AuthContext'
import { ClientOnly } from '../../../lib/helpers/ClientOnly'
import { useRequest } from '../../../lib/helpers/useRequest'
import { useAuthConfig } from '../../../lib/hooks/useAuthConfig'
import { waitForSessionCookie } from '../../../utils/cookies'

type Provider = { id: string; name?: string }

function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/account'

  // Ambil konfigurasi via SWR
  const { data: rawConfig, error: configError, isLoading: loadingConfig } = useAuthConfig()

  const isSignupOpen = rawConfig?.data?.account?.is_open_for_signup ?? false
  const socialProviders = rawConfig?.data?.socialaccount?.providers ?? []

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { trigger: doSignup, error: signupError, loading: loadingSignup } = useRequest(signUp)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const resp = await doSignup({ email, password })
    if (resp?.meta?.is_authenticated) {
      await mutate('/auth/session')
      await waitForSessionCookie()
      router.push(next)
    }
  }

  if (loadingConfig) {
    return <div className="container mt-5">Memuat konfigurasi…</div>
  }
  if (configError) {
    return <div className="container mt-5 text-danger">Gagal memuat konfigurasi.</div>
  }

  return (
    <div className="container mt-5" style={{ maxWidth: 500 }}>
      <h2 className="mb-3">Daftar Akun</h2>

      {!isSignupOpen ? (
        <div className="alert alert-warning">
          <p className="mb-1">Pendaftaran akun baru ditutup.</p>
          <p className="mb-0">
            Ajukan permintaan undangan di{' '}
            <Link href="/account/invitation" className="text-primary">
              halaman undangan
            </Link>.
          </p>
        </div>
      ) : (
        <>
          <p>
            Sudah punya akun? <Link href="/account/login">Login di sini</Link>
          </p>

          {signupError && <div className="alert alert-danger">{signupError}</div>}

          <form onSubmit={handleSubmit} className="mb-4">
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loadingSignup}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loadingSignup}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loadingSignup}>
              {loadingSignup ? 'Mendaftar…' : 'Daftar'}
            </button>
          </form>

          {socialProviders.length > 0 && (
            <div>
              <h5>Atau daftar dengan:</h5>
              <ul className="list-unstyled">
                {socialProviders.map((provider: Provider) => (
                  <li key={provider.id} className="mb-2">
                    <button
                      onClick={() =>
                        redirectToProvider(provider.id, '/account/provider/callback', AuthProcess.LOGIN)
                      }
                      className="btn btn-outline-secondary w-100"
                    >
                      Daftar dengan {provider.name ?? provider.id}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  )
}

const AnonymousSignup = withAnonymous(SignupPage)

export default function SignupPageWrapper() {
  return (
    <ClientOnly>
      <AnonymousSignup />
    </ClientOnly>
  )
}
