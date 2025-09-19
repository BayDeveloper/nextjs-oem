// app/admin/blog/[id]/[slug]/posts/[postId]/view/PostCover.tsx
"use client"

import React from "react"

interface PostCoverProps {
  src?: string | null
  alt?: string
}

export default function PostCover({ src, alt }: PostCoverProps) {
  if (!src) return null

  return (
    <div className="mb-4 text-center">
      <img
        src={src}
        alt={alt || "Cover image"}
        className="img-fluid rounded shadow-sm"
        style={{ maxHeight: 420, objectFit: "cover", width: "100%" }}
      />
    </div>
  )
}
