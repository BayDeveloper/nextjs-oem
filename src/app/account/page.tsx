// src/app/account/page.tsx
'use client'

import React from 'react'
import { withAuth } from '../../auth/AuthContext'
import { ClientOnly } from '../../lib/helpers/ClientOnly'
import { AccountContent } from './content'

const ProtectedAccount = withAuth(AccountContent)

export default function AccountPage() {
  return (
    <ClientOnly>
      <ProtectedAccount />
    </ClientOnly>
  )
}
