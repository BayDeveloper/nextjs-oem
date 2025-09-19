// app/account/sessions/page.tsx
'use client'

import React, { useMemo } from 'react'
import { withAuth, useConfig } from '../../../auth/AuthContext'
import {
  endSessions,
  SessionType
} from '../../../lib/allauth'
import { useRequest } from '../../../lib/helpers/useRequest'
import Button from '../../../components/Button'
import { ClientOnly } from '../../../lib/helpers/ClientOnly'
import { useSessions } from '../../../lib/hooks/useSessions'

function SessionsPage() {
  const config = useConfig()
  const { data, isLoading: fetching, mutate } = useSessions()
  const sessions: SessionType[] = data?.data ?? []

  const { trigger: doLogout, loading: loggingOut } = useRequest(endSessions)

  const handleLogout = async (target: SessionType[]) => {
    const resp = await doLogout(target.map((s) => s.id))
    if (resp?.status === 200) mutate()
  }

  const otherSessions = useMemo(
    () => sessions.filter((s) => !s.is_current),
    [sessions]
  )

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Sesi Aktif</h2>

      {fetching ? (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-2">Memuat sesi aktif...</p>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Waktu Masuk</th>
                  <th>IP Address</th>
                  <th>Browser</th>
                  {Boolean(config?.usersessions?.track_activity) && <th>Terakhir Aktif</th>}
                  <th>Sesi Ini</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session.id}>
                    <td>{new Date(session.created_at * 1000).toLocaleString()}</td>
                    <td>{session.ip}</td>
                    <td>{session.user_agent}</td>
                    {Boolean(config?.usersessions?.track_activity) && (
                      <td>{session.last_seen_at ?? '-'}</td>
                    )}
                    <td>{session.is_current ? '⭐' : ''}</td>
                    <td>
                      {!session.is_current && (
                        <Button onClick={() => handleLogout([session])} disabled={loggingOut || fetching}>
                          Logout
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sessions.length === 0 && (
            <p className="text-muted text-center mt-3">
              Tidak ada sesi aktif yang ditemukan.
            </p>
          )}

          <Button
            className="btn btn-danger mt-3"
            disabled={otherSessions.length <= 0 || loggingOut || fetching}
            onClick={() => handleLogout(otherSessions)}
          >
            Logout dari Sesi Lain
          </Button>
        </>
      )}
    </div>
  )
}

const ProtectedSessions = withAuth(SessionsPage)

export default function SecuredSessions() {
  return (
    <ClientOnly>
      <ProtectedSessions />
    </ClientOnly>
  )
}
