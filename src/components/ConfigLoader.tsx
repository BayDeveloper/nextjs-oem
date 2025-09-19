'use client'

import React, { useEffect } from 'react'
import { useConfig } from '../auth/AuthContext'
import { isConfigReady } from '../utils/isConfigReady'

interface ConfigLoaderProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function ConfigLoader({
  children,
  fallback = <DefaultConfigFallback />,
}: ConfigLoaderProps) {
  const config = useConfig()

  useEffect(() => {
    console.log('[ConfigLoader] config:', config)
    if (!isConfigReady(config)) {
      console.warn('[ConfigLoader] config belum siap:', config)
      console.log('[ConfigLoader] config:', config)
      console.log('[ConfigLoader] isReady:', isConfigReady(config))
    }
  }, [config])

  if (!isConfigReady(config)) {
    return fallback
  }

  return <>{children}</>
}

function DefaultConfigFallback() {
  return (
    <div className="text-center my-5">
      <div className="spinner-border text-primary" role="status" />
      <p className="mt-3">Memuat konfigurasi...</p>
    </div>
  )
}
