// lib/django.ts
export function getCSRFToken(): string | null {
  if (typeof document === 'undefined') return null

  const getCookie = (name: string): string | null => {
    const cookies = document.cookie.split(';')
    for (const cookie of cookies) {
      const trimmed = cookie.trim()
      if (trimmed.startsWith(`${name}=`)) {
        return decodeURIComponent(trimmed.substring(name.length + 1))
      }
    }
    return null
  }

  return getCookie('csrftoken')
}

