// app/blog/[slug]/[postSlug]/layout.tsx
import React from "react"
import { blogPostMetadata } from "./metadata"

export const metadata = blogPostMetadata

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
