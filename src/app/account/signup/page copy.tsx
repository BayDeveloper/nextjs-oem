'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { mutate } from 'swr'

import { signUp, redirectToProvider, AuthProcess, fetchCSRFToken } from '../../../lib/allauth'
import { getCSRFToken } from '../../../lib/django'
import { waitForSessionCookie } from '../../../utils/cookies'
import { withAnonymous, useConfig } from '../../../auth/AuthContext'
import { ClientOnly } from '../../../lib/helpers/ClientOnly'
import { useRequest } from '../../../lib/helpers/useRequest'
import ConfigLoader from '../../../components/ConfigLoader'

type Provider = {
  id: string
  name?: string
}

function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/account'

  const rawConfig = useConfig()

  const isSignupOpen = useMemo(
    () => rawConfig?.account?.is_open_for_signup ?? true,
    [rawConfig?.account?.is_open_for_signup]
  )
  const socialProviders = useMemo(
    () => rawConfig?.socialaccount?.providers || [],
    [rawConfig?.socialaccount?.providers]
  )

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { trigger, error, loading } = useRequest(signUp)

  useEffect(() => {
    if (typeof window !== 'undefined' && !getCSRFToken()) {
      console.info('[SignupPage] csrftoken tidak ditemukan, fetching...')
      fetchCSRFToken().catch((err) => {
        console.error('[SignupPage] Gagal fetch CSRF token:', err)
      })
    }

    console.log('[SignupPage] config loaded:', { isSignupOpen, socialProviders })
  }, [isSignupOpen, socialProviders])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const resp = await trigger({ email, password })
    if (resp?.meta?.is_authenticated) {
      await mutate('/auth/session', undefined, false)
      await waitForSessionCookie(1000)
      router.push(next)
    }
  }

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h2 className="mb-3">Daftar Akun</h2>

      {!rawConfig ? (
        <p>Memuat konfigurasi…</p>
      ) : (
        <>
          {!isSignupOpen ? (
            <div className="alert alert-warning">
              <p className="mb-1">Pendaftaran akun baru sedang ditutup.</p>
              <p className="mb-0">
                Anda dapat <Link href="/account/invitation" className="text-primary">mengajukan permintaan undangan</Link>.
              </p>
            </div>
          ) : (
            <>
              <p>
                Sudah punya akun? <Link href="/account/login">Login di sini</Link>
              </p>

              {error && <div className="alert alert-danger">{error}</div>}

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
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Mendaftar…' : 'Daftar'}
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
        </>
      )}
    </div>
  )
}

const SignupWithAnonymous = withAnonymous(React.memo(SignupPage))

export default function SignupPageWrapper() {
  return (
    <ClientOnly>
      <ConfigLoader>
        <SignupWithAnonymous />
      </ConfigLoader>
    </ClientOnly>
  )
}

