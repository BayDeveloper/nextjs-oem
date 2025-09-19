'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../auth/AuthContext'
import { useLogout } from '../auth/useLogout'
import clsx from 'clsx'

export default function Navbar() {
  const { isAuthenticated, user } = useAuth()
  const { triggerLogout } = useLogout()
  const [isCollapsed, setIsCollapsed] = useState(true)

  useEffect(() => {
    // Muat JavaScript bootstrap agar dropdown berfungsi
    import('bootstrap/dist/js/bootstrap.bundle.min.js')
  }, [])


  const toggleNavbar = () => setIsCollapsed((prev) => !prev)

  const displayName = useMemo(() => {
    if (!user) return null
    return String(user.email ?? user.username ?? 'User')
  }, [user])

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link href="/" className="navbar-brand">Next-Allauth</Link>
      <button
        className="navbar-toggler"
        type="button"
        onClick={toggleNavbar}
        aria-controls="navbarNav"
        aria-expanded={!isCollapsed}
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>

      <div
        className={clsx('collapse navbar-collapse', { show: !isCollapsed })}
        id="navbarNav"
      >
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link href="/calculator" className="nav-link">Calculator</Link>
          </li>
          {["admin", "manager", "staff"].includes(user?.role) && (
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="appDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                App
              </a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="appDropdown">
                <>
                  {user?.is_superuser && user?.role === "admin" && (
                    <li><Link href="/admin/users/status" className="dropdown-item">User Status</Link></li>
                  )}

                  {user?.is_superuser && ["admin", "manager"].includes(user?.role) && (
                    <li><Link href="/admin/users/roles" className="dropdown-item">User Roles</Link></li>
                  )}

                  {["admin", "manager"].includes(user?.role) && (
                    <li><Link href="/admin/invitations" className="dropdown-item">Invitations</Link></li>
                  )}

                  {["admin", "manager", "staff"].includes(user?.role) && (
                    <li><Link href="/admin/blog" className="dropdown-item">Blog</Link></li>
                  )}
                </>
              </ul>
            </li>
          )}
          <li className="nav-item">
            <Link href="/blog" className="nav-link">Blog</Link>
          </li>
        </ul>

        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
          {isAuthenticated ? (
            <>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="accountDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {displayName}
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="accountDropdown">
                  <li><Link href="/account" className="dropdown-item">Profil</Link></li>
                  <li><Link href="/account/email" className="dropdown-item">Email</Link></li>
                  <li><Link href="/account/password/change" className="dropdown-item">Ubah Password</Link></li>
                  <li><Link href="/account/sessions" className="dropdown-item">Sesi Aktif</Link></li>
                  <li><Link href="/account/provider" className="dropdown-item">Akun Sosial</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button onClick={triggerLogout} className="dropdown-item text-danger">
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link href="/account/login" className="nav-link">Login</Link>
              </li>
              <li className="nav-item">
                <Link href="/account/signup" className="nav-link">Signup</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}
