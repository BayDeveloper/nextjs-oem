"use client"

import useSWR from "swr"
import { request } from "../../../lib/allauth"

export interface User {
  id: number
  email: string
  role: string
}

export function useUsers() {
  const { data, error, isLoading, mutate } = useSWR<User[]>(
    "/accounts/users-roles/",
    (url: string) => request<User[]>("GET", url)
  )

  return {
    users: data ?? [],
    isLoading,
    isError: !!error,
    mutate,
  }
}
