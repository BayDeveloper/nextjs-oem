// app/account/layout.tsx
import React from "react"
import { accountMetadata } from "./metadata"

export const metadata = accountMetadata

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container py-5" style={{ maxWidth: "800px" }}>
      {children}
    </div>
  )
}
