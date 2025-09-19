"use client"

import useSWR from "swr"
import { request } from "../../lib/allauth"

export interface BlogRole {
  value: "admin" | "editor" | "author"
  label: string
}

/**
 * Fetch daftar role blog (untuk dropdown UI).
 */
export function useBlogRoles() {
  const { data, error, isLoading, mutate } = useSWR<BlogRole[]>(
    "/blog/roles/",
    (url: string) => request<BlogRole[]>("GET", url),   // ✅ fixed
    { revalidateOnFocus: false }
  )

  return {
    roles: data ?? [],
    isLoading,
    isError: !!error,
    mutate,
  }
}
