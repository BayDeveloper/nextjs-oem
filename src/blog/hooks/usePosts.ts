// blog/hooks/usePosts.ts
"use client"

import useSWR from "swr"
import { request } from "../../lib/allauth"
import { Post } from "../types"

export function usePosts(blogId: string) {
  const { data, error, isLoading, mutate } = useSWR<Post[]>(
    `/blog/posts/?blog=${blogId}`,
    async (url: string) => {
      const res = await request<any>("GET", url)
      // Normalisasi supaya selalu array
      return Array.isArray(res) ? res : res?.results ?? []
    }
  )

  return {
    posts: data ?? [],   // ✅ dijamin array
    isLoading,
    isError: !!error,
    mutate,
  }
}
