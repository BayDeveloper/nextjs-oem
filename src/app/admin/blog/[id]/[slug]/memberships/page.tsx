// app/admin/blog/[id]/[slug]/memberships/page.tsx
"use client"

import React from "react"
import MembershipTable from "../../../../../../blog/components/MembershipTable"
import { useParams } from "next/navigation"
import Link from "next/link"

export default function MembershipPage() {
  const params = useParams()
  const id = params?.id as string
  const slug = params?.slug as string

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Manage Memberships</h1>
        <Link href={`/admin/blog/${id}/${slug}`} className="btn btn-outline-secondary">
          ← Back to Blog
        </Link>
      </div>
      <MembershipTable />
    </div>
  )
}
