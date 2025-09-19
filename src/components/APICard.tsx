'use client'

import React from 'react'

export type APIResponse<T = unknown> = {
  status: number | 'Error'
  data: T | string
}

interface APICardProps {
  title: string
  docs: string
  response: APIResponse
}

export default function APICard({ title, docs, response }: APICardProps) {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <a href={docs} target="_blank" rel="noopener noreferrer">
          API documentation
        </a>
        <div className="mb-3 mt-3">
          <label className="form-label">Status</label>
          <input
            className="form-control"
            value={response.status}
            readOnly
          />
        </div>
        <pre className="overflow-x-scroll">
          {typeof response.data === 'string'
            ? response.data
            : JSON.stringify(response.data, null, 4)}
        </pre>
      </div>
    </div>
  )
}
