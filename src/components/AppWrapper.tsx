// src/components/AppWrapper.tsx
'use client'

import React from 'react'
import { SWRConfig } from 'swr'
import { csrfMiddleware } from '../auth/csrfMiddleware'

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig value={{
      use: [csrfMiddleware],
    }}>
      {children}
    </SWRConfig>
  )
}
