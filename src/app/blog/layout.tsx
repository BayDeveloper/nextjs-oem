// app/blog/layout.tsx
import React from "react"
import { blogMetadata } from "./metadata"

export const metadata = blogMetadata

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
