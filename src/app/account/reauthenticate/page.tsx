// src/app/account/reauthenticate/page.tsx
'use client'

import React from 'react'
import { withAuth } from '../../../auth/AuthContext'
import { ReauthenticateContent } from './content'
import { ClientOnly } from '../../../lib/helpers/ClientOnly'

const Fallback = (
  <div className="container mt-5" style={{ maxWidth: 480 }}>
    <h2>Verifikasi Ulang</h2>
    <form>{/* Placeholder */}</form>
  </div>
)

function ReauthenticatePage() {
  const Protected = withAuth(ReauthenticateContent, '/account/login', Fallback)
  return <ClientOnly>{<Protected />}</ClientOnly>
}

export default ReauthenticatePage

