// lib/hooks/useAuthConfig.ts
import useSWR from 'swr'
import { getConfig, ConfigResponse } from '../allauth'

export function useAuthConfig() {
  return useSWR<ConfigResponse>('/auth/config', getConfig, {
    revalidateOnFocus: false,
    dedupingInterval: 5 * 60 * 1000,
  })
}
