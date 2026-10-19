import { describe, expect, it } from "vitest"

import { serializeJsonLd } from "../../lib/site/json-ld"

describe("JSON-LD serialization", () => {
  it("escapes HTML-sensitive angle brackets", () => {
    expect(serializeJsonLd({ value: "</script>" })).toBe(
      '{"value":"\\u003c/script>"}'
    )
  })
})
