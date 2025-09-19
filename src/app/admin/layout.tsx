// src/app/admin/layout.tsx
import React from "react"
import { adminMetadata } from "./metadata"
import AdminClientWrapper from "./AdminClientWrapper"

export const metadata = adminMetadata

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container py-4">
      <AdminClientWrapper>{children}</AdminClientWrapper>
    </div>
  )
}
