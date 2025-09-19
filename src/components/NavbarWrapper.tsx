'use client'

import React from 'react'
import dynamic from 'next/dynamic'

// ✅ Import Navbar dynamically with SSR off
const Navbar = dynamic(() => import('./Navbar'), { ssr: false })

export default function NavbarWrapper() {
  return <Navbar />
}
