import { describe, expect, it } from "vitest"

import {
  buildDocsNav,
  docHref,
  docSlugFromPath,
  findDocPage,
  getDocTitle,
  isDocPath,
  resolveDocAssetSrc,
  resolveDocLink,
  type DocPage,
} from "../../lib/docs/paths"

const docPaths = new Set([
  "README.md",
  "install.md",
  "guide/README.md",
  "guide/setup.md",
  "guide/advanced/tips.md",
])

function page(path: string, title: string): DocPage {
  return { path, slug: docSlugFromPath(path), title, markdown: "" }
}

describe("docs routes", () => {
  it("maps repository markdown files to docs slugs", () => {
    expect(docSlugFromPath("README.md")).toEqual([])
    expect(docSlugFromPath("install.md")).toEqual(["install"])
    expect(docSlugFromPath("guide/README.md")).toEqual(["guide"])
    expect(docSlugFromPath("guide/setup.md")).toEqual(["guide", "setup"])
  })

  it("encodes slugs when building hrefs", () => {
    expect(docHref([])).toBe("/docs")
    expect(docHref(["guide", "first steps"])).toBe("/docs/guide/first%20steps")
  })

  it("only treats markdown outside hidden folders as documentation", () => {
    expect(isDocPath("guide/setup.md")).toBe(true)
    expect(isDocPath("images/board.png")).toBe(false)
    expect(isDocPath(".github/PULL_REQUEST_TEMPLATE.md")).toBe(false)
  })

  it("finds a page by its slug", () => {
    const pages = [
      page("README.md", "Overview"),
      page("guide/setup.md", "Setup"),
    ]

    expect(findDocPage(pages, [])?.path).toBe("README.md")
    expect(findDocPage(pages, ["guide", "setup"])?.path).toBe("guide/setup.md")
    expect(findDocPage(pages, ["missing"])).toBeUndefined()
  })
})

describe("docs titles", () => {
  it("uses the first heading and ignores headings inside code blocks", () => {
    expect(getDocTitle("# Install\n\nSteps", "install.md")).toBe("Install")
    expect(
      getDocTitle("```bash\n# not a title\n```\n\n# Real title", "x.md")
    ).toBe("Real title")
  })

  it("falls back to the file or folder name when there is no heading", () => {
    expect(getDocTitle("Just text", "setup-guide.md")).toBe("Setup guide")
    expect(getDocTitle("Just text", "guide/README.md")).toBe("Guide")
    expect(getDocTitle("Just text", "README.md")).toBe("Overview")
  })
})

describe("docs links", () => {
  it("resolves relative markdown links to docs routes", () => {
    expect(
      resolveDocLink("setup.md", { fromPath: "guide/README.md", docPaths })
    ).toBe("/docs/guide/setup")
    expect(
      resolveDocLink("../install.md#step-2", {
        fromPath: "guide/setup.md",
        docPaths,
      })
    ).toBe("/docs/install#step-2")
    expect(
      resolveDocLink("advanced/tips.md", {
        fromPath: "guide/setup.md",
        docPaths,
      })
    ).toBe("/docs/guide/advanced/tips")
  })

  it("keeps in-page anchors and external links as they are", () => {
    const context = { fromPath: "guide/setup.md", docPaths }

    expect(resolveDocLink("#overview", context)).toBe("#overview")
    expect(resolveDocLink("https://example.com/a", context)).toBe(
      "https://example.com/a"
    )
  })

  it("sends links to other repository files to GitHub", () => {
    expect(
      resolveDocLink("../LICENSE", {
        fromPath: "guide/setup.md",
        docPaths,
      })
    ).toBe("https://github.com/gambit-devs/user-docs/blob/main/LICENSE")
    expect(
      resolveDocLink("missing.md", { fromPath: "README.md", docPaths })
    ).toBe("https://github.com/gambit-devs/user-docs/blob/main/missing.md")
  })

  it("resolves relative images against the raw repository", () => {
    expect(resolveDocAssetSrc("images/board.png", "guide/setup.md")).toBe(
      "https://raw.githubusercontent.com/gambit-devs/user-docs/main/guide/images/board.png"
    )
    expect(
      resolveDocAssetSrc("https://example.com/a.png", "guide/setup.md")
    ).toBe("https://example.com/a.png")
  })
})

describe("docs navigation", () => {
  it("groups pages by folder with each folder's overview first", () => {
    const nav = buildDocsNav([
      page("guide/setup.md", "Setup"),
      page("install.md", "Install"),
      page("guide/README.md", "Guide home"),
      page("README.md", "Overview"),
      page("guide/advanced/tips.md", "Tips"),
    ])

    expect(nav.map((group) => group.label)).toEqual([
      null,
      "Guide",
      "Guide / Advanced",
    ])
    expect(nav[0].items.map((item) => item.title)).toEqual([
      "Overview",
      "Install",
    ])
    expect(nav[1].items.map((item) => item.title)).toEqual([
      "Guide home",
      "Setup",
    ])
  })
})
