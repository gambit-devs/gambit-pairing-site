import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { DownloadGettingStarted } from "@/components/download/getting-started"
import { LATEST_RELEASE_URL } from "@/lib/site/config"
import {
  DOWNLOAD_PLATFORM_OPTIONS,
  PLATFORM_DETAILS,
  isPlatformSlug,
} from "@/lib/site/platforms"

type PlatformPageProps = PageProps<"/download/[platform]">

export function generateStaticParams() {
  return DOWNLOAD_PLATFORM_OPTIONS.map(({ slug: platform }) => ({ platform }))
}

export async function generateMetadata({
  params,
}: PlatformPageProps): Promise<Metadata> {
  const { platform: requestedPlatform } = await params

  if (!isPlatformSlug(requestedPlatform)) {
    return { title: "Download" }
  }

  return {
    title: `Download for ${PLATFORM_DETAILS[requestedPlatform].label}`,
    description: `Download Gambit Pairing for ${PLATFORM_DETAILS[requestedPlatform].label}.`,
  }
}

export default async function PlatformDownloadPage({
  params,
}: PlatformPageProps) {
  const { platform: requestedPlatform } = await params

  if (!isPlatformSlug(requestedPlatform)) {
    notFound()
  }

  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-6 py-8 sm:px-8 sm:py-10">
        <header>
          <h1 className="max-w-5xl text-4xl leading-[1.08] font-bold tracking-tight sm:text-5xl">
            Thank you for downloading Gambit Pairing!
          </h1>
          <p className="mt-5 text-base text-foreground/85 sm:text-lg">
            Problems with the download?{" "}
            <a
              href={LATEST_RELEASE_URL}
              target="_blank"
              rel="noreferrer"
              className="text-[color:var(--download-button)] underline-offset-4 transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              Try again.
            </a>
          </p>
        </header>

        <DownloadGettingStarted />
      </div>
    </main>
  )
}
