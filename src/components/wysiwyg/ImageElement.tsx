// components/wysiwyg/ImageElement.tsx
"use client";

import React, { memo, useCallback } from "react";
import { RenderElementProps, useFocused, useSelected, ReactEditor } from "slate-react";
import { Transforms } from "slate";
import { useSlateStatic } from "slate-react";
import { ImageRenderer, Align } from "./ImageRenderer";
import type { ImageElementNode } from "./custom-types";
import { hasCaption, toggleCaption } from "./utils/caption";

interface ImageElementProps extends RenderElementProps {
  element: ImageElementNode;
  align?: Align;
  isEditing?: boolean;
}

function ImageElementComponent({
  attributes,
  children,
  element,
  align,
  isEditing = true,
}: ImageElementProps) {
  const editor = useSlateStatic();
  const selected = useSelected();
  const focused = useFocused();

  const path = ReactEditor.findPath(editor, element);
  const currentHasCaption = hasCaption(editor, element);

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      Transforms.removeNodes(editor, { at: path });
    },
    [editor, path]
  );

  const handleEditAlt = useCallback(() => {
    const newAlt = window.prompt("Enter alt text:", element.alt || "");
    if (newAlt !== null) {
      Transforms.setNodes(editor, { alt: newAlt }, { at: path });
    }
  }, [editor, element, path]);

  const handleAlign = useCallback(
    (a: Align) => {
      Transforms.setNodes(editor, { align: a }, { at: path });
    },
    [editor, path]
  );

  const handleToggleCaption = useCallback(() => {
    toggleCaption(editor, element);
  }, [editor, element]);

  return (
    <div {...attributes} style={{ textAlign: element.align ?? "center" }}>
      <figure style={{ display: "inline-block", margin: 0 }}>
        <ImageRenderer
          url={element.url}
          alt={element.alt}
          width={element.width}
          height={element.height}
          align={align ?? element.align ?? "center"}
          isEditing={isEditing}
          selected={selected}
          focused={focused}
          onRemove={handleRemove}
          onResize={(w, h) => {
            Transforms.setNodes(editor, { width: w, height: h }, { at: path });
          }}
          onEditAlt={handleEditAlt}
          onAlign={handleAlign}
          keepAspectRatio
          onToggleCaption={handleToggleCaption}
          hasCaption={currentHasCaption}
        />
        {children /* dummy text only */}
      </figure>
    </div>
  );
}

export const ImageElement = memo(ImageElementComponent, (prev, next) =>
  prev.element === next.element &&
  prev.align === next.align &&
  prev.isEditing === next.isEditing
);
