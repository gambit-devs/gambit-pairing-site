import { describe, expect, it } from "vitest"

import { formatBytes, isExternalUrl } from "../../lib/utils"

describe("formatBytes", () => {
  it("uses the largest unit that keeps the value under 1024", () => {
    expect(formatBytes(0)).toBe("0 B")
    expect(formatBytes(1023)).toBe("1023 B")
    expect(formatBytes(1536)).toBe("1.5 KB")
    expect(formatBytes(2 * 1024 * 1024)).toBe("2 MB")
    expect(formatBytes(85_000_000)).toBe("81.1 MB")
  })
})

describe("isExternalUrl", () => {
  it("recognizes absolute and protocol-relative URLs", () => {
    expect(isExternalUrl("https://example.com")).toBe(true)
    expect(isExternalUrl("mailto:someone@example.com")).toBe(true)
    expect(isExternalUrl("//cdn.example.com/a.js")).toBe(true)
  })

  it("treats paths and anchors as internal", () => {
    expect(isExternalUrl("install.md")).toBe(false)
    expect(isExternalUrl("images/board.png")).toBe(false)
    expect(isExternalUrl("#top")).toBe(false)
  })
})
