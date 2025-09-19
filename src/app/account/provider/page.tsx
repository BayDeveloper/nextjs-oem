// app/account/provider/page.tsx
'use client'

import React, { useState } from 'react'
import { withAuth, useConfig } from '../../../auth/AuthContext'
import {
  disconnectProviderAccount,
  redirectToProvider,
  AuthProcess,
  ProviderAccount,
} from '../../../lib/allauth'
import Button from '../../../components/Button'
import { ClientOnly } from '../../../lib/helpers/ClientOnly'
import { useRequest } from '../../../lib/helpers/useRequest'
import { useProviderAccounts } from '../../../lib/hooks/useProviderAccounts'

function ProvidersPage() {
  const config = useConfig()
  const {
    data,
    mutate,
    isLoading: loadingAccounts,
    error: fetchError,
  } = useProviderAccounts()

  const accounts: ProviderAccount[] = data?.data ?? []
  const socialProviders = config?.socialaccount?.providers ?? []

  // ✅ pakai loadingId dari hook
  const {
    trigger: disconnect,
    error: disconnectError,
    loadingId,
  } = useRequest(disconnectProviderAccount)

  const [disconnectingId, setDisconnectingId] = useState<string | null>(null)

  const handleDisconnect = async (account: ProviderAccount) => {
    setDisconnectingId(account.uid)
    const res = await disconnect(account.provider.id, account.uid)
    if (res?.status === 200) mutate()
    setDisconnectingId(null)
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Akun Sosial yang Terhubung</h2>

      {/* ✅ Status akun terhubung */}
      {loadingAccounts && <p className="text-muted">⏳ Memuat akun sosial…</p>}
      {fetchError && (
        <div className="alert alert-danger">
          Gagal memuat akun sosial: {String(fetchError)}
        </div>
      )}

      <div className="table-responsive mb-4">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>UID</th>
              <th>Akun</th>
              <th>Provider</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.uid}>
                <td>{account.uid}</td>
                <td>{account.display}</td>
                <td>{account.provider.name}</td>
                <td>
                  <Button
                    onClick={() => handleDisconnect(account)}
                    disabled={loadingId !== null && disconnectingId === account.uid}
                  >
                    {loadingId !== null && disconnectingId === account.uid
                      ? 'Memutuskan…'
                      : 'Disconnect'}
                  </Button>
                </td>
              </tr>
            ))}
            {accounts.length === 0 && !loadingAccounts && (
              <tr>
                <td colSpan={4} className="text-center text-muted">
                  Tidak ada akun sosial yang terhubung.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {disconnectError && (
        <div className="alert alert-danger">
          Gagal memutuskan akun: {String(disconnectError)}
        </div>
      )}

      {/* ✅ Bagian daftar provider sosial */}
      <div className="mt-4">
        <h4>Hubungkan Akun Sosial Baru</h4>

        {!config && (
          <p className="text-muted">⏳ Memuat daftar provider…</p>
        )}

        {config && socialProviders.length === 0 && (
          <div className="alert alert-info">
            Tidak ada provider sosial yang tersedia saat ini.
          </div>
        )}

        {socialProviders.length > 0 && (
          <ul className="list-unstyled">
            {socialProviders.map((provider) => (
              <li key={provider.id} className="mb-2">
                <button
                  onClick={() =>
                    redirectToProvider(
                      provider.id,
                      '/account/provider/callback',
                      AuthProcess.CONNECT
                    )
                  }
                  className="btn btn-outline-secondary w-100"
                >
                  Hubungkan dengan {provider.name ?? provider.id}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

const ProtectedProvidersPage = withAuth(ProvidersPage)

export default function SecuredProvidersPage() {
  return (
    <ClientOnly>
      <ProtectedProvidersPage />
    </ClientOnly>
  )
}
