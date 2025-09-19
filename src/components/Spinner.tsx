// src/components/Spinner.tsx
import React from 'react'

interface SpinnerProps {
  small?: boolean
  className?: string
}

export default function Spinner({ small = false, className = '' }: SpinnerProps) {
  const sizeClass = small ? 'spinner-border-sm' : 'spinner-border'
  return (
    <div className={`spinner ${sizeClass} ${className}`} role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  )
}
