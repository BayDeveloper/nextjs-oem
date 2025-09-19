"use client"

import React from "react"
import clsx from "clsx"

export const Button = ({
  className,
  active,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) => (
  <button
    {...props}
    className={clsx(
      "btn btn-sm me-1",
      active ? "btn-primary text-white" : "btn-light border",
      className
    )}
    type="button"
  />
)

export const Icon = ({ name }: { name: string }) => (
  <i className={`bi bi-${name}`} />
)

export const Toolbar = ({ children }: { children: React.ReactNode }) => (
  <div className="d-flex flex-wrap mb-2 border rounded p-1 bg-light">
    {children}
  </div>
)
