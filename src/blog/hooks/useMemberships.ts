"use client"

import useSWR from "swr"
import { request } from "../../lib/allauth"
import { Membership } from "../types"

type PaginatedResponse<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export function useMemberships(blogId: string | number) {
  const { data, error, isLoading, mutate } = useSWR<
    Membership[] | PaginatedResponse<Membership>
  >(
    blogId ? `/blog/memberships/?blog=${blogId}` : null,
    (url: string) =>
      request<Membership[] | PaginatedResponse<Membership>>("GET", url) // ✅ kasih generic
  )

  const memberships =
    Array.isArray(data) ? data : data?.results ?? []

  return {
    memberships,
    isLoading,
    isError: !!error,
    mutate,
  }
}
