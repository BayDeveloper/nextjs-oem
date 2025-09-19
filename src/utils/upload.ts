// utils/upload.ts
import { request } from "../lib/allauth"

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)

  const data = await request<{ url: string }>(
    "POST",
    "/blog/uploads/image/",
    formData
  )

  return data.url
}
