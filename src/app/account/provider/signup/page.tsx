// app/account/provider/signup/page.tsx
'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ProviderSignupRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/account/signup')
  }, [router])

  return (
    <div className="container mt-5 text-center">
      <p>Mengalihkan ke halaman signup…</p>
    </div>
  )
}
