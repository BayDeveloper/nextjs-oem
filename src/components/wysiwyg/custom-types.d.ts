// components/wysiwyg/custom-types.d.ts
import { BaseEditor, Descendant } from "slate"
import { ReactEditor } from "slate-react"

export type CustomText = {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  code?: boolean
}

export type CustomElementType =
  | "paragraph"
  | "heading-one"
  | "heading-two"
  | "block-quote"
  | "blockquote-footer"
  | "numbered-list"
  | "bulleted-list"
  | "list-item"
  | "image"
  | "caption"
  | "code-block"

export interface CustomElementWithAlign {
  align?: "left" | "center" | "right" | "justify"
}

export type ParagraphElement = {
  type: "paragraph"
  children: Descendant[]
} & CustomElementWithAlign

export type CaptionElement = {
  type: "caption"
  children: { text: string }[]
}

export type ImageElementNode = {
  type: "image"
  url: string
  alt?: string
  align?: "left" | "center" | "right"
  width?: number
  height?: number
  children: [{ text: "" }] // wajib ada 1 text kosong
}

export type OtherElement = {
  type: Exclude<CustomElementType, "paragraph" | "image">
  align?: "left" | "center" | "right" | "justify"
  children: Descendant[]
}

export type CustomElement =
  | ParagraphElement
  | ImageElementNode
  | OtherElement
  | CaptionElement

export type CustomEditor = BaseEditor & ReactEditor
export type CustomTextKey = keyof Omit<CustomText, "text">

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
    Text: CustomText
  }
}
