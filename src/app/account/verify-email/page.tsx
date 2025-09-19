// app/account/verify-email/page.tsx
'use client'

import React from 'react'
import Link from 'next/link'
import { ClientOnly } from '../../../lib/helpers/ClientOnly'

export default function VerifyEmailPage() {
  return (
    <ClientOnly>
      <div className="container mt-5" style={{ maxWidth: 500 }}>
        <h2 className="mb-4">Verifikasi Email</h2>
        <p>
          Kami telah mengirimkan link verifikasi ke alamat email Anda.
          Silakan cek kotak masuk (dan folder spam) untuk menemukannya.
        </p>
        <p>
          Jika Anda belum menerima email dalam beberapa menit, Anda dapat{' '}
          <Link href="/account/verify-email/request" className="text-primary">
            meminta kirim ulang
          </Link>.
        </p>
        <p className="mt-4">
          Setelah mengeklik link verifikasi, Anda dapat{' '}
          <Link href="/account/login" className="text-primary">
            masuk ke akun Anda
          </Link>.
        </p>
      </div>
    </ClientOnly>
  )
}
