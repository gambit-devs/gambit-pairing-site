import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const BYTE_UNITS = ["B", "KB", "MB", "GB"]

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`

  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    BYTE_UNITS.length - 1
  )
  const value = Number((bytes / 1024 ** exponent).toFixed(1))

  return `${value} ${BYTE_UNITS[exponent]}`
}

export function isExternalUrl(href: string) {
  return /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href)
}
