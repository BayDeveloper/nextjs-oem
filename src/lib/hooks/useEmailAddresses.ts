// lib/hooks/useEmailAddresses.ts
import useSWR from 'swr'
import { getEmailAddresses } from '../allauth'

export function useEmailAddresses() {
  return useSWR('/auth/email', getEmailAddresses)
}
