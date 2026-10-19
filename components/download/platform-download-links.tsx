import Link from "next/link"

import { platformDownloadPath, PLATFORM_OPTIONS } from "@/lib/site/platforms"

const platformLinkClassName =
  "inline-flex h-12 min-w-0 w-full items-center justify-center bg-[var(--download-button)] px-4 text-lg font-bold text-white transition-none hover:bg-[var(--download-button-hover)] active:bg-[var(--download-button-active)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:h-14 sm:text-xl"

export function PlatformDownloadLinks() {
  return (
    <section
      aria-labelledby="platform-downloads-heading"
      className="mt-8 flex w-full justify-center"
    >
      <div className="w-full max-w-3xl px-6">
        <h2 id="platform-downloads-heading" className="sr-only">
          Download Gambit Pairing
        </h2>

        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
          {PLATFORM_OPTIONS.map((platform) => (
            <Link
              key={platform.slug}
              href={platformDownloadPath(platform.slug)}
              aria-label={`Download Gambit Pairing for ${platform.label}`}
              className={platformLinkClassName}
            >
              {platform.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
