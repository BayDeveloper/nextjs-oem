// blog/hooks/useBlogs.ts
"use client"

import useSWR from "swr"
import { request } from "../../lib/allauth"
import { Blog } from "../types"

export function useBlogs() {
  const { data, error, isLoading, mutate } = useSWR(
    "/blog/blogs/",
    async (url: string) => {
      const res = await request<any>("GET", url)
      return Array.isArray(res) ? res : res?.results ?? []
    }
  )

  return {
    blogs: (data as Blog[]) ?? [],
    isLoading,
    isError: !!error,
    mutate,
  }
}
