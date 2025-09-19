// src/app/admin/AdminClientWrapper.tsx
"use client"

import React from "react"
import dynamic from "next/dynamic"

const BootstrapInit = dynamic(() => import("../../components/BootstrapInit"), {
  ssr: false,
})

export default function AdminClientWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <BootstrapInit />
    </>
  )
}
