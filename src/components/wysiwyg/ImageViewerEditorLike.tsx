// components/wysiwyg/ImageViewerEditorLike.tsx
"use client";

import React from "react";
import { ImageBase } from "./ImageBase";
import type { Align } from "./ImageRenderer";

interface ImageViewerEditorLikeProps {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  align?: Align;
  className?: string;
  style?: React.CSSProperties;
}

export function ImageViewerEditorLike({
  url,
  alt,
  width,
  height,
  align = "center",
  className,
  style,
}: ImageViewerEditorLikeProps) {
  const containerStyle: React.CSSProperties = {
    display: "block",
    textAlign: align,
    ...style,
  };

  return (
    <div style={containerStyle}>
      <ImageBase
        url={url}
        alt={alt}
        width={width}
        height={height}
        align={align}
        isEditing={false}
        selected={false}
        focused={false}
        className={className ?? "rounded"}
        style={{ float: undefined, margin: undefined }}
      />
    </div>
  );
}
