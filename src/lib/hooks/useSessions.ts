// lib/hooks/useSessions.ts
import useSWR from 'swr'
import { getSessions } from '../allauth'

export function useSessions() {
  return useSWR('/auth/sessions', async () => await getSessions(), {
    revalidateOnFocus: true
  })
}
