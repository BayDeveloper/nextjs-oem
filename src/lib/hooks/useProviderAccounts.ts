// lib/hooks/useProviderAccounts.ts
import useSWR from 'swr'
import { getProviderAccounts } from '../allauth'

export function useProviderAccounts() {
  return useSWR('/account/provider', getProviderAccounts)
}
