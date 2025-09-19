// components/wysiwyg/withImages.ts
import { Transforms, Element as SlateElement } from "slate";
import type { CustomEditor, ImageElementNode } from "./custom-types";

export const withImages = <T extends CustomEditor>(editor: T): T => {
  const { normalizeNode } = editor;

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    if (path.length === 0 && editor.children.length === 0) {
      Transforms.insertNodes(editor, { type: "paragraph", children: [{ text: "" }] });
      return;
    }

    // Normalizer khusus image
    if (SlateElement.isElement(node) && node.type === "image") {
      const imageNode = node as ImageElementNode;

      // 1) image harus punya tepat 1 text child kosong
      if (
        !imageNode.children ||
        imageNode.children.length !== 1 ||
        !("text" in imageNode.children[0])
      ) {
        Transforms.removeNodes(editor, { at: path });
        Transforms.insertNodes(
          editor,
          {
            ...imageNode,
            children: [{ text: "" }],
          },
          { at: path }
        );
        return;
      }
    }

    // fallback ke normalizer asli
    normalizeNode(entry);
  };

  return editor;
};
