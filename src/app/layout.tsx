// === src/app/layout.tsx ===
import React from 'react'
import { cookies } from 'next/headers'
import { AuthProvider, AuthContextType } from '../auth/AuthContext'
import NavbarWrapper from '../components/NavbarWrapper'
import 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap-icons/font/bootstrap-icons.css";
import './globals.css'
import { ConfigType, getAuthSSR, getConfigSSR } from '../lib/allauth'
import { SWRConfig } from 'swr'
import AppWrapper from '../components/AppWrapper'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieHeader = await cookies()
  const sessionid = cookieHeader.get('sessionid')?.value || null

  let initialAuth: AuthContextType | undefined = undefined

  let initialConfig: ConfigType | null = null

  try {
    if (sessionid) {
      console.log('[RootLayout] Ada sessionid, ambil auth + config')

      const [authRes, configRaw] = await Promise.all([
        getAuthSSR(sessionid),
        getConfigSSR(),
      ])

      const data = authRes.data ?? {}
      const meta = authRes.meta ?? {}

      type Flow = {
        id: string
        providers?: string[]
        [key: string]: unknown
      }

      const flows: Flow[] = data.flows ?? []
      const providerFlow = flows.find((f) => f.id === 'provider_redirect')
      const providers = providerFlow?.providers ?? []

      initialAuth = {
        isAuthenticated: meta.is_authenticated ?? false,
        user: data.user ?? null,
        flows,
        providers,
        methods: data.methods ?? [],
        tokens: {
          session_token: meta.session_token,
          access_token: meta.access_token,
        },
        loading: false,
        lastReauthenticatedAt: typeof meta.last_reauthenticated_at === 'string'
          ? meta.last_reauthenticated_at
          : null,
      }

      initialConfig = configRaw?.data ?? configRaw ?? null
    } else {
      console.log('[RootLayout] Tidak ada sessionid, hanya ambil config')
      const configRaw = await getConfigSSR()
      initialConfig = configRaw?.data ?? configRaw ?? null
    }
  } catch (err) {
    console.error('[RootLayout] Gagal ambil auth/config:', err)
  }

  return (
    <html lang="en">
      <body>
        <SWRConfig value={{
          fallback: {
            '/auth/session': initialAuth,
            '/auth/config': initialConfig,
          }
        }}>
          <AppWrapper>
            <AuthProvider initialAuth={initialAuth} initialConfig={initialConfig}>
              <NavbarWrapper />
              {children}
            </AuthProvider>
          </AppWrapper>
        </SWRConfig>
      </body>
    </html>
  )
}
