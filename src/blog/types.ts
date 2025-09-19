// blog/types.ts
export interface Blog {
  id: number
  title: string
  slug: string
  description?: string
  owner: number
  owner_email: string
  created_at: string
}

export interface BlogRole {
  value: "admin" | "editor" | "author"
  label: string
}

export interface Membership {
  id: number
  blog: number
  user: number
  user_email: string
  role: string
  role_display: string
  added_at: string
}

export interface Post {
  id: number
  blog: number
  title: string
  slug: string
  content: string
  cover_image?: string   // ✅ baru, optional (karena bisa null/blank di backend)
  published: boolean
  published_at?: string
  created_at: string
  updated_at: string
  author: number
  author_email: string
}
