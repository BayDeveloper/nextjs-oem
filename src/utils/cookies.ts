'use client'

export async function waitForSessionCookie(timeout = 1000): Promise<boolean> {
  let waited = 0
  while (!document.cookie.includes('sessionid') && waited < timeout) {
    await new Promise((res) => setTimeout(res, 50))
    waited += 50
  }
  return document.cookie.includes('sessionid')
}
