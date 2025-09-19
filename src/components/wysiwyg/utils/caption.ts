// components/wysiwyg/utils/caption.ts
import { Node, Element, Path, Transforms } from "slate";
import { ReactEditor } from "slate-react";
import type { CustomEditor, ImageElementNode, CaptionElement } from "../custom-types";

export function hasCaption(editor: CustomEditor, image: ImageElementNode): boolean {
  const path = ReactEditor.findPath(editor, image);

  if (path[0] >= editor.children.length - 1) {
    return false;
  }

  try {
    const nextEntry = Node.get(editor, Path.next(path));
    return Element.isElement(nextEntry) && nextEntry.type === "caption";
  } catch {
    return false;
  }
}

export function toggleCaption(editor: CustomEditor, image: ImageElementNode) {
  const path = ReactEditor.findPath(editor, image);
  const nextPath = Path.next(path);

  if (path[0] >= editor.children.length) return;

  const nextNode = (editor.children as any)[nextPath[0]];
  if (Element.isElement(nextNode) && nextNode.type === "caption") {
    // remove caption
    Transforms.removeNodes(editor, { at: nextPath });
  } else {
    // insert caption
    const captionNode: CaptionElement = {
      type: "caption",
      children: [{ text: "" }],
    };
    Transforms.insertNodes(editor, captionNode, { at: nextPath });
  }
}
