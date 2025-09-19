// components/wysiwyg/SlateDebugger.tsx
"use client";

import { useEffect } from "react";
import { useSlateStatic } from "slate-react";
import { Descendant, Text, Element } from "slate";
import type { ImageElementNode, CaptionElement } from "./custom-types";

/**
 * Transformasi node Slate jadi bentuk debug-friendly
 */
function simplifyNode(node: Descendant): any {
  if (Text.isText(node)) {
    return {
      text: node.text,
      bold: (node as any).bold,
      italic: (node as any).italic,
      underline: (node as any).underline,
      code: (node as any).code,
    };
  }

  if ("type" in node) {
    if ((node as any).type === "image") {
      const img = node as ImageElementNode;
      return {
        type: "image",
        url: img.url,
        alt: img.alt,
        width: img.width,
        height: img.height,
        align: img.align,
      };
    }

    if ((node as any).type === "caption") {
      const cap = node as CaptionElement;
      return {
        type: "caption",
        text: cap.children.map((c) => ("text" in c ? c.text : "")).join(""),
      };
    }

    return {
      type: (node as any).type,
      children: "children" in node ? (node as any).children.map(simplifyNode) : [],
    };
  }

  return node;
}

/**
 * SlateDebugger: log full tree + image + caption sibling info
 */
export function SlateDebugger({ label = "SlateValue" }: { label?: string }) {
  const editor = useSlateStatic();

  useEffect(() => {
    if (!editor || !editor.children) return;

    const simplified = (editor.children as Descendant[]).map(simplifyNode);
    console.log(`[${label}] full tree:`, simplified);

    // cek pasangan image + caption sebagai sibling
    const nodes = editor.children as Element[];
    const debugImages = nodes
      .map((n, i) => {
        if (n.type === "image") {
          const img = n as ImageElementNode;
          const next = nodes[i + 1];
          const caption =
            next && next.type === "caption"
              ? (next as CaptionElement).children.map((c) =>
                "text" in c ? c.text : ""
              ).join("")
              : null;

          return {
            url: img.url,
            alt: img.alt,
            width: img.width,
            height: img.height,
            align: img.align,
            caption: caption || "(none)",
            captionSibling: caption ? "valid (next sibling)" : "no caption",
          };
        }
        return null;
      })
      .filter(Boolean);

    console.log(`[${label}] images:`, debugImages);
  }, [editor.children, label, editor]);

  return null;
}
