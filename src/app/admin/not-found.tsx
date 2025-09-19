import React from "react"
import Link from "next/link"

export default function AdminNotFound() {
  return (
    <div className="container py-5 text-center">
      <h1 className="h4 mb-3">Halaman Admin Tidak Ditemukan</h1>
      <p className="text-muted">Periksa kembali URL yang Anda akses.</p>
      <Link href="/admin" className="btn btn-outline-secondary mt-3">
        ← Kembali ke Dashboard Admin
      </Link>
    </div>
  )
}
