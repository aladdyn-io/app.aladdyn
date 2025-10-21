import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getUserId = () => {
  const user = localStorage.getItem('user')
  try {
    if (user) {
      const parsed = JSON.parse(user)
      return parsed.id || parsed.userId || ''
    }
  } catch {
    return ''
  }
  return ''
}