import { useAuth } from '../auth/AuthContext'

export function useRecentlyReauthenticated(): boolean {
  const { user, methods, lastReauthenticatedAt } = useAuth()

  // ✅ Bypass reauth kalau user memang tidak punya password
  if (user && user.has_usable_password === false) {
    return true
  }

  const FIVE_MINUTES = 5 * 60 * 1000
  const reauthenticated = methods?.some(m => m.reauthenticated) || false

  if (reauthenticated) return true
  if (!lastReauthenticatedAt) return false

  return Date.now() - new Date(lastReauthenticatedAt).getTime() < FIVE_MINUTES
}
