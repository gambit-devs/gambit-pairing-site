import { Apple, Terminal } from "lucide-react"

import { PlatformDownloadLinks } from "@/components/download/platform-download-links"
import { FAQ } from "@/components/home/faq"
import { Features } from "@/components/home/features"
import { GitHubContributors } from "@/components/home/github-contributors"
import { SiteFooter } from "@/components/layout/site-footer"
import { Picture } from "@/components/media/picture"
import { SiteNavigation } from "@/components/navigation/site-navigation"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { FancyText } from "@/components/ui/fancy-text"
import { getHomeData } from "@/lib/github/client"
import { FAQ_ITEMS } from "@/lib/site/faq"
import { SITE_URL } from "@/lib/site/config"
import { serializeJsonLd } from "@/lib/site/json-ld"

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${SITE_URL}/#faq`,
  url: `${SITE_URL}/#faq`,
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
}

function WindowsLogo() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5 shrink-0 fill-current"
    >
      <path d="M1 3.2 10.8 1.8V11H1V3.2Zm12-1.7L23 0v11H13V1.5ZM1 13h9.8v9.2L1 20.8V13Zm12 0h10v11l-10-1.5V13Z" />
    </svg>
  )
}

export default async function Page() {
  const { latestRelease, contributors } = await getHomeData()

  return (
    <main className="flex min-h-svh flex-col pt-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(faqJsonLd),
        }}
      />
      <header className="flex flex-col items-center gap-8">
        <h1 aria-label="Gambit Pairing">
          <FancyText
            className="text-center text-5xl leading-none font-black text-foreground/10"
            fillClassName="text-foreground"
          >
            Gambit Pairing
          </FancyText>
        </h1>
        <SiteNavigation latestVersion={latestRelease.version} />
        <section
          aria-label={`Latest release ${latestRelease.version}, ${latestRelease.date}`}
          className="-my-2 flex w-full justify-center px-6"
        >
          <div className="flex min-h-14 w-full max-w-sm items-center gap-2 overflow-hidden px-3 text-xs font-bold tracking-wide text-foreground sm:text-sm">
            <span className="shrink-0">Latest Release</span>
            <span
              aria-hidden="true"
              className="flex shrink-0 items-center gap-1.5"
            >
              <WindowsLogo />
              <Apple className="size-5 shrink-0" strokeWidth={2.5} />
              <Terminal className="size-5 shrink-0" strokeWidth={2.5} />
            </span>
            <span className="shrink-0">
              {latestRelease.version} - {latestRelease.date}
            </span>
          </div>
        </section>
        <PlatformDownloadLinks />
        <section
          aria-labelledby="product-description-heading"
          className="flex w-full justify-center px-6 text-center"
        >
          <h2 id="product-description-heading" className="sr-only">
            About Gambit Pairing
          </h2>
          <p className="max-w-2xl text-base leading-7 font-medium text-foreground/70 sm:text-lg">
            <span className="block">
              Free and open source chess tournament pairing software.
            </span>
            <span className="block">
              Download and start pairing on Windows, Mac or Linux.
            </span>
          </p>
        </section>
        <section
          id="screenshots"
          aria-labelledby="product-screenshot-heading"
          className="flex w-full justify-center px-6"
        >
          <h2 id="product-screenshot-heading" className="sr-only">
            Gambit Pairing screenshot
          </h2>
          <figure className="w-full max-w-3xl overflow-hidden border border-border bg-muted">
            <AspectRatio ratio="1325/944" className="relative">
              <Picture
                src="/screenshots/app_with_background.webp"
                alt="Gambit Pairing desktop app showing the empty tournament screen"
                priority
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AspectRatio>
          </figure>
        </section>
        <Features />
        <GitHubContributors contributors={contributors} />
      </header>
      <FAQ />
      <SiteFooter />
    </main>
  )
}
