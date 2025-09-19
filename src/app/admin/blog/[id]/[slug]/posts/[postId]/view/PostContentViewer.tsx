// app/admin/blog/[id]/[slug]/posts/[postId]/view/PostContentViewer.tsx
"use client"

import React from "react"
import { Descendant } from "slate"
import { renderNode } from "../../../../../../../../components/wysiwyg/renderers"

interface PostContentViewerProps {
  nodes: Descendant[]
  fallbackAlt?: string
}

export default function PostContentViewer({ nodes, fallbackAlt }: PostContentViewerProps) {
  if (!nodes || nodes.length === 0) return <p>No content</p>

  return (
    <div className="post-content">
      {nodes.map((node, i) => renderNode(node, i, fallbackAlt))}
    </div>
  )
}
