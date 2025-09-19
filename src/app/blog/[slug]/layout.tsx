// app/blog/[slug]/layout.tsx
import React from "react"
import { blogDetailMetadata } from "./metadata"

export const metadata = blogDetailMetadata

export default function BlogDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
