// app/account/password/change/page.tsx
'use client'

import dynamic from 'next/dynamic'

// ⛔️ Hindari SSR agar tidak terjadi hydration mismatch
const ChangePasswordClient = dynamic(() => import('./ChangePasswordClient'), {
  ssr: false,
})

export default ChangePasswordClient
