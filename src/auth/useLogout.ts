'use client'

import { useCallback, useState, useEffect } from 'react'
import { fetchCSRFToken, logout } from '../lib/allauth'
import { useAuth } from './AuthContext'
import { useRouter } from 'next/navigation'
import { mutate } from 'swr'

type LogoutError = {
  status?: number
  [key: string]: unknown
}

export function useLogout(redirectTo: string = '/account/login') {
  const [logoutRequested, setLogoutRequested] = useState(false)
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  const triggerLogout = useCallback(async () => {
    try {
      await fetchCSRFToken()
      await logout()
    } catch (err: unknown) {
      const error = err as LogoutError
      if (error.status !== 401) {
        console.error('Logout error:', error)
      }
    } finally {
      await mutate('/auth/session', null, false)
      setLogoutRequested(true)
    }
  }, [])

  useEffect(() => {
    if (!loading && !isAuthenticated && logoutRequested) {
      router.replace(redirectTo)
    }
  }, [loading, isAuthenticated, logoutRequested, router, redirectTo])

  return { triggerLogout, logoutRequested }
}
