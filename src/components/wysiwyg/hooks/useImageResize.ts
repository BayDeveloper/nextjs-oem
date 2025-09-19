// components/wysiwyg/hooks/useImageResize.ts
import { useCallback } from "react"
import { Transforms } from "slate"
import { ReactEditor, useSlateStatic } from "slate-react"
import type { ImageElementNode } from "../custom-types"

export function useImageResize(
  element: ImageElementNode,
  keepAspectRatio: boolean = true
) {
  const editor = useSlateStatic()
  const path = ReactEditor.findPath(editor, element)

  const handleResize = useCallback(
    (newWidth: number, newHeight?: number) => {
      let finalWidth = newWidth
      let finalHeight = newHeight ?? element.height

      if (keepAspectRatio && element.width && element.height) {
        const ratio = element.height / element.width
        finalHeight = Math.round(finalWidth * ratio)
      }

      Transforms.setNodes(
        editor,
        { width: finalWidth, height: finalHeight },
        { at: path }
      )

      return { width: finalWidth, height: finalHeight }
    },
    [editor, path, element.width, element.height, keepAspectRatio]
  )

  return { handleResize }
}
