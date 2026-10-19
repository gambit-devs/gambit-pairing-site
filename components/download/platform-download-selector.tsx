"use client"

import { Fragment, useState } from "react"
import { useRouter } from "next/navigation"
import { Download, ExternalLink } from "lucide-react"

import {
  CodeBlock,
  CodeBlockCode,
  CodeBlockHeader,
  CodeBlockPre,
} from "@/components/ui/cubby-ui/code-block/code-block"
import type { LatestRelease } from "@/lib/github/types"
import {
  getPlatformDownload,
  RELEASE_LINKS,
  type DownloadOption,
} from "@/lib/site/downloads"
import {
  DOWNLOAD_PLATFORM_OPTIONS,
  type PlatformSlug,
} from "@/lib/site/platforms"
import {
  DOWNLOAD_LINK_CLASS_NAME,
  SECTION_LABEL_CLASS_NAME,
} from "@/lib/site/styles"
import { cn } from "@/lib/utils"

type PlatformFilter = PlatformSlug | "all"

type DownloadClickEvent = {
  defaultPrevented: boolean
  button: number
  metaKey: boolean
  ctrlKey: boolean
  shiftKey: boolean
  altKey: boolean
  preventDefault: () => void
}

type DirectDownloadHandler = (
  event: DownloadClickEvent,
  option: DownloadOption,
  platform: PlatformSlug
) => void

const RELEASE_DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
})

const FILTER_OPTIONS: { label: string; value: PlatformFilter }[] = [
  ...DOWNLOAD_PLATFORM_OPTIONS.map(({ label, slug }) => ({
    label,
    value: slug,
  })),
  { label: "All", value: "all" },
]

const SECONDARY_LINK_CLASS_NAME =
  "transition-colors hover:text-foreground hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"

function DownloadRow({
  option,
  platform,
  onDirectDownload,
}: {
  option: DownloadOption
  platform: PlatformSlug
  onDirectDownload: DirectDownloadHandler
}) {
  const isDirect = option.status === "direct"
  const label = isDirect ? `Download ${option.installType}` : option.actionLabel

  return (
    <li className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        {isDirect ? (
          <p className="font-mono text-sm break-words">{option.assetName}</p>
        ) : (
          <p className="text-sm font-medium">{option.installType}</p>
        )}
        <p className="text-xs text-muted-foreground">
          {isDirect
            ? `${option.installType} · ${option.size}`
            : option.description}
        </p>
      </div>
      <a
        href={option.actionUrl}
        download={isDirect ? option.assetName : undefined}
        target={isDirect ? undefined : "_blank"}
        rel={isDirect ? undefined : "noreferrer"}
        onClick={
          isDirect
            ? (event) => onDirectDownload(event, option, platform)
            : undefined
        }
        aria-label={`${label}: ${option.name}`}
        className={DOWNLOAD_LINK_CLASS_NAME}
      >
        {isDirect ? (
          <Download aria-hidden="true" className="size-3.5" />
        ) : (
          <ExternalLink aria-hidden="true" className="size-3.5" />
        )}
        {option.actionLabel}
      </a>
    </li>
  )
}

function CommandBlock({ label, code }: { label: string; code: string }) {
  return (
    <div className="max-w-md">
      <p className={SECTION_LABEL_CLASS_NAME}>{label}</p>
      <CodeBlock code={code} language="bash" className="mt-2 rounded-lg p-0">
        <CodeBlockHeader />
        <CodeBlockPre nativeScroll fadeEdges={false} className="rounded-lg">
          <CodeBlockCode className="text-xs" />
        </CodeBlockPre>
      </CodeBlock>
    </div>
  )
}

function PlatformSection({
  platform,
  latestRelease,
  onDirectDownload,
  isFirst,
}: {
  platform: PlatformSlug
  latestRelease: LatestRelease
  onDirectDownload: DirectDownloadHandler
  isFirst: boolean
}) {
  const download = getPlatformDownload(platform, latestRelease)
  const availableOptions = download.options.filter(
    ({ status }) => status !== "unavailable"
  )

  return (
    <section
      aria-labelledby={`${platform}-downloads-heading`}
      className={cn("mt-14", !isFirst && "border-t border-border pt-14")}
    >
      <h2
        id={`${platform}-downloads-heading`}
        className="text-2xl font-bold tracking-tight"
      >
        Gambit Pairing for {download.label}
      </h2>
      <p className="mt-2 leading-7 text-muted-foreground">
        {download.description}
      </p>

      <section aria-labelledby={`${platform}-files-heading`} className="mt-8">
        <h3
          id={`${platform}-files-heading`}
          className={SECTION_LABEL_CLASS_NAME}
        >
          Downloads
        </h3>
        {availableOptions.length > 0 ? (
          <ul className="mt-3 divide-y divide-border border-y border-border">
            {availableOptions.map((option) => (
              <DownloadRow
                key={option.id}
                option={option}
                platform={platform}
                onDirectDownload={onDirectDownload}
              />
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            No files are published for {download.label} in this release.
          </p>
        )}
      </section>

      <div className="mt-8 flex flex-col gap-8 text-sm">
        <div>
          <h3 className={SECTION_LABEL_CLASS_NAME}>System requirements</h3>
          <p className="mt-3 leading-6 text-muted-foreground">
            {download.requirements.join(" · ")}
          </p>
        </div>

        {platform === "python" ? (
          <div className="flex flex-col gap-6">
            {download.command ? (
              <CommandBlock label="Install command" code={download.command} />
            ) : null}
            {download.launchCommand ? (
              <CommandBlock
                label="Run this command to launch the app."
                code={download.launchCommand}
              />
            ) : null}
          </div>
        ) : (
          <div>
            <h3 className={SECTION_LABEL_CLASS_NAME}>Installation</h3>
            <p className="mt-3 leading-6 text-muted-foreground">
              {download.installation}
            </p>
            {platform === "linux" && download.command ? (
              <div className="mt-5">
                <CommandBlock
                  label="FYI: install the Python package"
                  code={download.command}
                />
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  )
}

export function PlatformDownloadSelector({
  latestRelease,
}: {
  latestRelease: LatestRelease
}) {
  const router = useRouter()
  const [selectedFilter, setSelectedFilter] =
    useState<PlatformFilter>("windows")
  const releasedOn = RELEASE_DATE_FORMAT.format(
    new Date(latestRelease.publishedAt)
  )
  const selectedLabel =
    FILTER_OPTIONS.find(({ value }) => value === selectedFilter)?.label ?? ""
  const visiblePlatforms =
    selectedFilter === "all"
      ? DOWNLOAD_PLATFORM_OPTIONS.map(({ slug }) => slug)
      : [selectedFilter]

  function handleDirectDownload(
    event: DownloadClickEvent,
    option: DownloadOption,
    platform: PlatformSlug
  ) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      !option.actionUrl
    ) {
      return
    }

    event.preventDefault()

    const downloadFrame = document.createElement("iframe")
    downloadFrame.src = option.actionUrl
    downloadFrame.title = `Downloading ${option.name}`
    downloadFrame.tabIndex = -1
    downloadFrame.setAttribute("aria-hidden", "true")
    downloadFrame.hidden = true
    document.body.append(downloadFrame)
    window.setTimeout(() => downloadFrame.remove(), 1500)

    router.push(`/download/${platform}`)
  }

  return (
    <div>
      <section aria-label="Stable version">
        <p className="text-muted-foreground">
          Version{" "}
          <strong className="text-foreground">{latestRelease.version}</strong> ·{" "}
          {releasedOn}
        </p>
        <p className="mt-2 flex flex-wrap gap-x-4 text-sm text-muted-foreground">
          {RELEASE_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className={SECONDARY_LINK_CLASS_NAME}
            >
              {link.label}
            </a>
          ))}
        </p>
      </section>

      <nav
        aria-label="Filter downloads by operating system"
        className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm"
      >
        <span className="text-muted-foreground">Show downloads for</span>
        {FILTER_OPTIONS.map((option, index) => {
          const isSelected = option.value === selectedFilter

          return (
            <Fragment key={option.value}>
              {index > 0 ? (
                <span aria-hidden="true" className="text-muted-foreground">
                  |
                </span>
              ) : null}
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedFilter(option.value)}
                className={cn(
                  "underline-offset-4 transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
                  isSelected
                    ? "font-bold text-foreground underline"
                    : "text-[color:var(--download-button)]"
                )}
              >
                {option.label}
              </button>
            </Fragment>
          )
        })}
      </nav>

      {visiblePlatforms.map((platform, index) => (
        <PlatformSection
          key={platform}
          platform={platform}
          latestRelease={latestRelease}
          onDirectDownload={handleDirectDownload}
          isFirst={index === 0}
        />
      ))}

      <p className="sr-only" aria-live="polite">
        Showing downloads for {selectedLabel}
      </p>
    </div>
  )
}
