'use client'

import React from "react"
import { useConfig } from '../auth/AuthContext'
import { redirectToProvider, settings, Client, AuthProcess } from '../lib/allauth'


type Props = {
  callbackURL: string
  process?: 'login' | 'connect'
}

export default function ProviderList({ callbackURL, process = AuthProcess.LOGIN }: Props) {
  const config = useConfig()
  const providers = config?.socialaccount?.providers || []

  if (!providers.length) return null

  return (
    <>
      {settings.client === Client.BROWSER && (
        <ul className="list-unstyled">
          {providers.map(provider => (
            <li key={provider.id} className="mb-2">
              <button
                onClick={() => redirectToProvider(provider.id, callbackURL, process)}
                className="btn btn-outline-secondary w-100"
              >
                Login dengan {provider.name ?? provider.id}
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
