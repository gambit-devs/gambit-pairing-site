import {
  BookOpen,
  Bug,
  CircleHelp,
  Code,
  Download,
  MessageCircle,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

import {
  DISCORD_URL,
  ISSUES_URL,
  LATEST_RELEASE_URL,
  ORGANIZATION_URL,
  PYPI_URL,
  RELEASES_URL,
  REPOSITORY_URL,
  SITE_ANCHORS,
} from "@/lib/site/config"

type FooterLink = {
  label: string
  href: string
  icon?: LucideIcon
}

const PRIMARY_LINKS: FooterLink[] = [
  { label: "Download", href: SITE_ANCHORS.downloads, icon: Download },
  { label: "Documentation", href: SITE_ANCHORS.docs, icon: BookOpen },
  { label: "FAQ", href: SITE_ANCHORS.faq, icon: CircleHelp },
  { label: "Source code", href: REPOSITORY_URL, icon: Code },
  { label: "Report an issue", href: ISSUES_URL, icon: Bug },
  { label: "Discord", href: DISCORD_URL, icon: MessageCircle },
]

const SECONDARY_LINKS: FooterLink[] = [
  { label: "Release notes", href: LATEST_RELEASE_URL },
  { label: "Previous releases", href: RELEASES_URL },
  { label: "PyPI package", href: PYPI_URL },
  { label: "Gambit Devs on GitHub", href: ORGANIZATION_URL },
]

const focusRingClassName =
  "rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
const linkClassName = `${focusRingClassName} hover:text-foreground`

function FooterLinkItem({
  href,
  className,
  children,
}: {
  href: string
  className: string
  children: ReactNode
}) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    )
  }

  return (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {children}
    </a>
  )
}

const cornerClassName = "absolute bottom-0 hidden size-3 lg:block"

// Inside corners where the hill meets the strip below it.
function InsideCorners() {
  return (
    <>
      <span
        aria-hidden="true"
        className={`${cornerClassName} -left-3 bg-[radial-gradient(circle_at_0_0,transparent_0.75rem,var(--artwork-tint)_0.75rem)]`}
      />
      <span
        aria-hidden="true"
        className={`${cornerClassName} -right-3 bg-[radial-gradient(circle_at_100%_0,transparent_0.75rem,var(--artwork-tint)_0.75rem)]`}
      />
    </>
  )
}

export function SiteFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto pt-24 text-white">
      <div className="relative mx-auto w-full rounded-t-[2.5rem] artwork-panel px-10 pt-8 pb-6 lg:w-fit">
        <InsideCorners />

        <nav
          aria-label="Primary footer links"
          className="grid justify-items-center gap-x-12 gap-y-5 md:grid-cols-[repeat(3,auto)] md:justify-items-normal md:gap-y-6"
        >
          {PRIMARY_LINKS.map(({ label, href, icon: Icon }) => (
            <FooterLinkItem
              key={label}
              href={href}
              className={`${linkClassName} flex items-center gap-3 text-base font-medium tracking-[0.08em] text-white uppercase sm:text-lg`}
            >
              {Icon ? (
                <Icon aria-hidden="true" className="size-5 shrink-0" />
              ) : null}
              {label}
            </FooterLinkItem>
          ))}
        </nav>

        <nav
          aria-label="Secondary footer links"
          className="mt-3 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm"
        >
          {SECONDARY_LINKS.map(({ label, href }) => (
            <FooterLinkItem
              key={label}
              href={href}
              className={`${linkClassName} text-white/80`}
            >
              {label}
            </FooterLinkItem>
          ))}
        </nav>
      </div>

      <div className="border-t border-white/20 artwork-panel">
        <p className="mx-auto w-full max-w-4xl px-6 pt-5 text-center text-xs text-white/70 sm:px-8">
          © {currentYear} Gambit Devs. Licensed under the GPLv3.
        </p>
        <p className="mx-auto w-full max-w-4xl px-6 pt-1 pb-5 text-center text-[11px] text-white/80 sm:px-8">
          Background artwork adapted from &quot;Adwaita&quot; by The GNOME
          Project, used under CC BY-SA 3.0.
        </p>
      </div>
    </footer>
  )
}
