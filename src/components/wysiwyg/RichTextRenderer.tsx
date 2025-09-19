// components/wysiwyg/RichTextRenderer.tsx
"use client";

import React from "react";
import { Descendant } from "slate";
import { renderNode } from "./renderers";

interface Props {
  value: Descendant[];
}

export default function RichTextRenderer({ value }: Props) {
  return <div>{value.map((node, i) => renderNode(node, i))}</div>;
}
