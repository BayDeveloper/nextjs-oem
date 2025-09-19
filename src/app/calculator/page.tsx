'use client'

import React, { useState, useCallback } from 'react'
import APICard, { APIResponse } from '../../components/APICard'
import {
  settings,
} from '../../lib/allauth'

export default function CalculatorPage() {
  const [x, setX] = useState<string>('')
  const [y, setY] = useState<string>('')
  const [drfResponse, setDrfResponse] = useState<APIResponse>({ status: 0, data: '' })
  const [ninjaResponse, setNinjaResponse] = useState<APIResponse>({ status: 0, data: '' })
  const [loading, setLoading] = useState(false)

  const fetchResult = useCallback(
    async (
      url: string,
      x: string,
      y: string,
      setResponse: React.Dispatch<React.SetStateAction<APIResponse>>
    ) => {
      const query = new URLSearchParams({ x, y }).toString()
      const options: RequestInit = { headers: {} }

      if (settings.withCredentials) {
        options.credentials = 'include'
      }

      try {
        const res = await fetch(`${url}?${query}`, options)
        const data = await res.json()
        setResponse({ status: res.status, data })
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Terjadi kesalahan tak dikenal'
        setResponse({ status: 'Error', data: message })
      }
    },
    []
  )

  const onCalculate = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (isNaN(Number(x)) || isNaN(Number(y))) {
        alert('Masukkan angka yang valid untuk x dan y.')
        return
      }

      let origin: string
      try {
        origin = new URL(settings.baseUrl).origin
      } catch {
        alert(`Base URL tidak valid: ${settings.baseUrl}`)
        return
      }

      setLoading(true)
      await Promise.all([
        fetchResult(`${origin}/drf/api/add/`, x, y, setDrfResponse),
        fetchResult(`${origin}/ninja/api/add`, x, y, setNinjaResponse),
      ])
      setLoading(false)
    },
    [x, y, fetchResult]
  )

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Calculator</h2>
      <form onSubmit={onCalculate}>
        <fieldset disabled={loading}>
          <div className="mb-3">
            <label htmlFor="inputX" className="form-label">
              𝓍
            </label>
            <input
              id="inputX"
              type="number"
              className="form-control"
              value={x}
              onChange={(e) => setX(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="inputY" className="form-label">
              𝓎
            </label>
            <input
              id="inputY"
              type="number"
              className="form-control"
              value={y}
              onChange={(e) => setY(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {loading ? 'Calculating…' : 'Add these inputs'}
          </button>
        </fieldset>
      </form>

      <div className="row mt-5">
        <div className="col-md-6 mb-4">
          <APICard
            title="Ninja"
            docs="/ninja/api/docs"
            response={ninjaResponse}
          />
        </div>
        <div className="col-md-6 mb-4">
          <APICard
            title="Django REST Framework"
            docs="/drf/api/schema/redoc/"
            response={drfResponse}
          />
        </div>
      </div>
    </div>
  )
}
