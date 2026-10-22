import { expect, test } from "@playwright/test"

import { LATEST_RELEASE_API_URL, REPOSITORY_URL } from "../../lib/site/config"

test.describe("site route contract", () => {
  test("home renders its primary sections", async ({ page }) => {
    await page.goto("/")

    await expect(page).toHaveTitle(/Gambit Pairing/)
    await expect(
      page.getByRole("heading", { name: "Gambit Pairing", exact: true })
    ).toBeVisible()
    await expect(
      page.getByRole("heading", {
        name: "Everything you need.",
      })
    ).toBeVisible()
    await expect(page.getByRole("heading", { name: "FAQ" })).toBeVisible()
    await expect(page.locator('[data-slot="navigation-menu"]')).toBeVisible()
  })

  test("platform links preserve the three download routes", async ({
    page,
  }) => {
    await page.goto("/")

    await expect(
      page.getByRole("link", { name: /Download Gambit Pairing for Windows/ })
    ).toHaveAttribute("href", "/download/windows")
    await expect(
      page.getByRole("link", { name: /Download Gambit Pairing for macOS/ })
    ).toHaveAttribute("href", "/download/macos")
    await expect(
      page.getByRole("link", { name: /Download Gambit Pairing for Linux/ })
    ).toHaveAttribute("href", "/download/linux")
  })

  test("main navigation opens the general download page", async ({ page }) => {
    await page.goto("/")

    await expect(
      page.locator('[data-slot="navigation-menu"]').getByRole("link", {
        name: "Download",
        exact: true,
      })
    ).toHaveAttribute("href", "/download")
  })

  test("gallery opens screenshots in an interactive viewer", async ({
    page,
  }) => {
    await page.goto("/gallery")

    await expect(page).toHaveTitle(/Gallery Modal/)
    await expect(
      page.locator('[aria-label="Featured screenshots"]')
    ).toBeVisible()
    const featuredCarousel = page.locator('[aria-label="Featured screenshots"]')
    const featuredSlides = featuredCarousel.locator("[data-featured-slide]")
    await expect(featuredSlides).toHaveCount(4)
    await expect(featuredSlides.nth(0)).toHaveClass(
      /(?:^|\s)is-in-view(?:\s|$)/
    )
    await expect(featuredSlides.nth(0)).toHaveClass(
      /(?:^|\s)is-snapped(?:\s|$)/
    )

    await featuredCarousel
      .getByRole("button", { name: "Next featured screenshot" })
      .click()
    await expect(featuredSlides.nth(0)).not.toHaveClass(
      /(?:^|\s)is-snapped(?:\s|$)/
    )
    await expect(featuredSlides.nth(1)).toHaveClass(
      /(?:^|\s)is-snapped(?:\s|$)/
    )
    await expect(featuredSlides.nth(0).getByRole("button").first()).toHaveCSS(
      "border-radius",
      "0px"
    )
    const swissPairingsImage = page.getByAltText("Swiss pairings")
    await expect(swissPairingsImage).toBeVisible()
    await swissPairingsImage.click()

    const dialog = page.getByRole("dialog")
    await expect(dialog).toBeVisible()
    await expect(dialog).toHaveAttribute("aria-label", "Swiss pairings")
    await expect(dialog.getByRole("link", { name: "Download" })).toHaveCount(0)
    await expect(dialog).toContainText("2 / 9")

    await dialog.getByRole("button", { name: "Next image" }).click()
    await expect(dialog).toHaveAttribute("aria-label", "Standings & tiebreaks")
    await expect(dialog).toContainText("3 / 9")

    await page.keyboard.press("Escape")
    await expect(dialog).not.toBeVisible()
  })

  test("featured carousel slides beside the centered one scroll to their screenshot", async ({
    page,
  }) => {
    await page.goto("/gallery")

    const featuredCarousel = page.locator('[aria-label="Featured screenshots"]')
    const featuredSlides = featuredCarousel.locator("[data-featured-slide]")
    await expect(featuredSlides.nth(0)).toHaveClass(
      /(?:^|\s)is-snapped(?:\s|$)/
    )

    await featuredSlides
      .nth(1)
      .locator("button")
      .click({ position: { x: 6, y: 10 } })

    await expect(featuredSlides.nth(1)).toHaveClass(
      /(?:^|\s)is-snapped(?:\s|$)/
    )
    await expect(page.getByRole("dialog")).toHaveCount(0)

    await featuredSlides.nth(1).locator("button").click()
    await expect(page.getByRole("dialog")).toBeVisible()
  })

  test("contributing page shows its development notice and the GitHub link", async ({
    page,
  }) => {
    await page.goto("/contributing")

    await expect(page).toHaveTitle(/Contributing/)
    await expect(
      page.getByRole("heading", { name: "Contributing", exact: true })
    ).toBeVisible()
    await expect(
      page.getByText("This page is still in development.")
    ).toBeVisible()
    await expect(
      page.getByRole("link", { name: "View the project on GitHub" })
    ).toHaveAttribute("href", REPOSITORY_URL)
  })

  test("navigation Contributing item links to the contributing page", async ({
    page,
  }) => {
    await page.goto("/")

    await page.getByRole("button", { name: "Resources", exact: true }).click()
    await page.getByRole("link", { name: /^Contributing/ }).click()

    await expect(page).toHaveURL(/\/contributing$/)
    await expect(
      page.getByRole("heading", { name: "Contributing", exact: true })
    ).toBeVisible()
  })

  test("featured carousel dots show a pointer cursor", async ({ page }) => {
    await page.goto("/gallery")

    const featuredCarousel = page.locator('[aria-label="Featured screenshots"]')
    const dots = featuredCarousel.locator("div.gap-2 > button")
    await expect(dots).toHaveCount(4)

    for (const dot of await dots.all()) {
      await expect(dot).toHaveCSS("cursor", "pointer")
    }
  })

  test("viewer image fills its frame without a black border", async ({
    page,
  }) => {
    await page.goto("/gallery")
    await page.getByAltText("Swiss pairings").click()

    const dialog = page.getByRole("dialog")
    await expect(dialog).toBeVisible()
    const frame = dialog.locator(".artwork-background").first()
    const wrapper = frame.locator("xpath=..")

    await expect(wrapper).toHaveCSS("padding-top", "0px")
    await expect(wrapper).toHaveCSS("padding-left", "0px")
    await expect(wrapper).toHaveCSS("background-color", "rgba(0, 0, 0, 0)")
  })

  test("gallery featured carousel autoplays and screenshot grid stays rigid", async ({
    page,
  }) => {
    await page.goto("/gallery")

    const featuredCarousel = page.locator('[aria-label="Featured screenshots"]')
    const featuredSlides = featuredCarousel.locator("[data-featured-slide]")
    const screenshotGrid = page.locator("[data-screenshot-grid]")
    const galleryItems = screenshotGrid.locator("[data-gallery-item]")

    await expect(screenshotGrid).toHaveClass(/grid/)
    await expect(galleryItems).toHaveCount(9)
    await expect(galleryItems.first()).toHaveCSS("border-radius", "0px")
    await expect
      .poll(
        async () =>
          featuredSlides.evaluateAll((elements) =>
            elements.findIndex((element) =>
              element.classList.contains("is-snapped")
            )
          ),
        { timeout: 6500 }
      )
      .not.toBe(0)
  })

  test("general download page filters downloads by operating system", async ({
    page,
  }) => {
    await page.goto("/download")

    await expect(page).toHaveTitle(/Download Gambit Pairing/)
    await expect(page.getByLabel("Download options")).toBeVisible()
    await expect(
      page.getByText("Download Gambit Pairing", { exact: true })
    ).not.toBeVisible()
    await expect(
      page.getByRole("region", { name: "Stable version" })
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "Gambit Pairing for Windows" })
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "Gambit Pairing for macOS" })
    ).not.toBeVisible()

    const macosFilter = page.getByRole("button", {
      name: "macOS",
      exact: true,
    })
    await macosFilter.click()

    await expect(macosFilter).toHaveAttribute("aria-pressed", "true")
    await expect(
      page.getByRole("heading", { name: "Gambit Pairing for macOS" })
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "Gambit Pairing for Windows" })
    ).not.toBeVisible()

    await page.getByRole("button", { name: "All", exact: true }).click()

    await expect(
      page.getByRole("heading", { name: "Gambit Pairing for Windows" })
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "Gambit Pairing for macOS" })
    ).toBeVisible()
    await expect(page).toHaveURL(/\/download$/)
  })

  test("Python has install and launch command blocks", async ({ page }) => {
    await page.goto("/download")

    const pythonFilter = page.getByRole("button", {
      name: "Python",
      exact: true,
    })

    await expect(pythonFilter).toBeVisible()
    await pythonFilter.click()

    await expect(
      page.getByRole("heading", { name: "Gambit Pairing for Python" })
    ).toBeVisible()
    const codeBlocks = page.locator('[data-slot="code-block"]')
    await expect(codeBlocks).toHaveCount(2)
    await expect(codeBlocks.nth(0)).toContainText(
      "python3 -m pip install gambit-pairing"
    )
    await expect(codeBlocks.nth(1)).toContainText("gambit-pairing")
    await expect(
      page.getByText("Installation", { exact: true })
    ).not.toBeVisible()
    await expect(
      page.getByText("Run this command to launch the app.", { exact: true })
    ).toBeVisible()
    await expect(
      page.getByRole("link", { name: "View on PyPI: Python package" })
    ).toBeVisible()
  })

  test("direct downloads hand off to the existing post-download page", async ({
    page,
  }) => {
    await page.route("https://github.com/**", (route) => route.abort())
    await page.goto("/download")

    const installerLink = page.getByRole("link", {
      name: "Download Setup installer: Windows x64 installer",
      exact: true,
    })

    await expect(installerLink).toBeVisible()
    await installerLink.click()
    await expect(page).toHaveURL(/\/download\/windows$/)
    await expect(
      page.getByRole("heading", {
        name: "Thank you for downloading Gambit Pairing!",
      })
    ).toBeVisible()
  })

  test("download page offers the newest GitHub release", async ({ page }) => {
    await page.route(LATEST_RELEASE_API_URL, (route) =>
      route.fulfill({
        json: {
          tag_name: "v9.9.9",
          published_at: "2030-01-01T00:00:00Z",
          assets: [
            {
              name: "GambitPairing-win-Setup.exe",
              browser_download_url:
                "https://github.com/gambit-devs/gambit-pairing/releases/download/v9.9.9/GambitPairing-win-Setup.exe",
              size: 52 * 1024 * 1024,
            },
          ],
        },
      })
    )
    await page.goto("/download")

    await expect(page.getByText("9.9.9", { exact: true })).toBeVisible()
    await expect(
      page.getByRole("link", {
        name: "Download Setup installer: Windows x64 installer",
        exact: true,
      })
    ).toBeVisible()
  })

  test("download page keeps the build-time release when GitHub is unreachable", async ({
    page,
  }) => {
    await page.route(LATEST_RELEASE_API_URL, (route) => route.abort())
    await page.goto("/download")

    await expect(
      page.getByRole("region", { name: "Stable version" })
    ).toContainText("Version")
    await expect(page.getByText("9.9.9", { exact: true })).toHaveCount(0)
    await expect(
      page.getByRole("heading", { name: "Gambit Pairing for Windows" })
    ).toBeVisible()
  })

  for (const platform of ["windows", "macos", "linux", "python"]) {
    test(`renders the ${platform} download route`, async ({ page }) => {
      const response = await page.goto(`/download/${platform}`)

      expect(response?.status()).toBe(200)
      await expect(
        page.getByRole("heading", {
          name: "Thank you for downloading Gambit Pairing!",
        })
      ).toBeVisible()
    })
  }

  test("unknown platform routes return not found", async ({ page }) => {
    const response = await page.goto("/download/plan9")

    expect(response?.status()).toBe(404)
  })

  test("not found page shows a chess piece and links back home", async ({
    page,
  }) => {
    const response = await page.goto("/no-such-page")

    expect(response?.status()).toBe(404)
    await expect(
      page.getByRole("heading", { name: "Page not found", exact: true })
    ).toBeVisible()
    await expect(page.locator('img[src^="/photos/"]').first()).toBeVisible()
    await expect(
      page.getByRole("link", { name: "Back to home", exact: true })
    ).toHaveAttribute("href", "/")
  })

  test("navigation and FAQ interactions respond", async ({ page }) => {
    await page.goto("/")

    await page.getByRole("button", { name: "Product" }).click()
    await expect(
      page.getByRole("link", { name: /Latest release Check out the/ })
    ).toBeVisible()

    const firstQuestion = page.getByRole("button", {
      name: "Is Gambit Pairing free?",
      exact: true,
    })
    await firstQuestion.scrollIntoViewIfNeeded()
    await firstQuestion.click()
    await expect(firstQuestion).toHaveAttribute("aria-expanded", "true")
  })

  test("footer lists primary and secondary links", async ({ page }) => {
    await page.goto("/")

    const footer = page.locator("footer")
    await expect(
      footer.getByRole("navigation", { name: "Primary footer links" })
    ).toBeVisible()
    await expect(
      footer.getByRole("navigation", { name: "Secondary footer links" })
    ).toBeVisible()
    await expect(
      footer.getByRole("link", { name: "FAQ", exact: true })
    ).toHaveAttribute("href", "/#faq")
    await expect(
      footer.getByRole("link", { name: "Source code", exact: true })
    ).toHaveAttribute("href", "https://github.com/gambit-devs/gambit-pairing")
  })

  test("footer uses the background artwork and links change color instantly on hover", async ({
    page,
  }) => {
    await page.goto("/")

    const canHover = await page.evaluate(
      () => matchMedia("(hover: hover)").matches
    )
    test.skip(!canHover, "touch devices do not apply hover styles")

    const footer = page.locator("footer")
    const faqLink = footer.getByRole("link", { name: "FAQ", exact: true })
    const foreground = await page.evaluate(() => {
      const probe = document.createElement("span")
      probe.style.color = "var(--foreground)"
      document.body.append(probe)
      const color = getComputedStyle(probe).color
      probe.remove()
      return color
    })

    await expect(footer.locator(":scope > div").first()).toHaveCSS(
      "background-image",
      /footer-background\.(jxl|webp)/
    )
    await expect(footer.locator(":scope > div").last()).toHaveCSS(
      "background-image",
      /footer-background\.(jxl|webp)/
    )
    await expect(faqLink).toHaveCSS("transition-duration", "0s")
    await faqLink.hover()
    await expect(faqLink).toHaveCSS("color", foreground)
  })

  test("navigation dropdown closes when hovering the Download link", async ({
    page,
  }) => {
    await page.goto("/")

    const navigation = page.locator('[data-slot="navigation-menu"]')
    const resourcesTrigger = navigation.getByRole("button", {
      name: "Resources",
      exact: true,
    })
    const downloadLink = navigation.getByRole("link", {
      name: "Download",
      exact: true,
    })
    const documentationLink = navigation.getByRole("link", {
      name: /Documentation Guides and API reference/,
    })

    await resourcesTrigger.hover()
    await expect(documentationLink).toBeVisible()
    await documentationLink.hover()
    await expect(resourcesTrigger).toHaveAttribute("aria-expanded", "true")

    await downloadLink.hover()

    await expect(resourcesTrigger).toHaveAttribute("aria-expanded", "false")
    await expect(documentationLink).not.toBeVisible()
  })
})

test.describe("visual contract", () => {
  test("home desktop and mobile renders remain stable", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveScreenshot("home.png", {
      fullPage: true,
      animations: "disabled",
      maskColor: test.info().project.name.includes("dark")
        ? "#171717"
        : "#ffffff",
      mask: [
        page.locator('section[aria-label^="Latest release"]'),
        page.locator("#contributors-heading").locator(".."),
      ],
    })
  })
})
