'use client'

import React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button className="btn btn-primary" {...props}>
      {children}
    </button>
  )
}
