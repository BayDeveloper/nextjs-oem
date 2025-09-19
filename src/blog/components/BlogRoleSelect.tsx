"use client"

import React from "react"
import { useBlogRoles } from "../hooks/useBlogRoles"

interface Props {
  value: string
  onChange: (val: string) => void
}

export default function BlogRoleSelect({ value, onChange }: Props) {
  const { roles, isLoading, isError } = useBlogRoles()

  if (isLoading) return <p>Loading roles...</p>
  if (isError) return <p>Gagal load roles</p>

  return (
    <select
      className="form-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {roles.map((r) => (
        <option key={r.value} value={r.value}>
          {r.label}
        </option>
      ))}
    </select>
  )
}
