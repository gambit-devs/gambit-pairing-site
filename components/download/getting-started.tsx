import {
  BookOpen,
  CircleHelp,
  Heart,
  MessageCircle,
  Zap,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

import {
  DISCORD_URL,
  DOCUMENTATION_URL,
  ISSUES_URL,
  PULL_REQUESTS_URL,
  REPOSITORY_URL,
} from "@/lib/site/config"
import { cn } from "@/lib/utils"

const inlineLinkClassName =
  "font-semibold text-[color:var(--download-button)] underline-offset-4 transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"

type Resource = {
  title: string
  description: ReactNode
  icon: LucideIcon
  iconClassName?: string
}

const RESOURCES: Resource[] = [
  {
    title: "Quickstart Guide",
    icon: Zap,
    iconClassName: "fill-current",
    description: (
      <>
        New to Gambit Pairing? Start with the{" "}
        <a
          href={`${REPOSITORY_URL}#readme`}
          target="_blank"
          rel="noreferrer"
          className={inlineLinkClassName}
        >
          quickstart guide
        </a>{" "}
        to run your first Swiss tournament.
      </>
    ),
  },
  {
    title: "Tournament Overview",
    icon: BookOpen,
    description: (
      <>
        See how Gambit Pairing handles players, pairings, standings, and{" "}
        <a
          href={DOCUMENTATION_URL}
          target="_blank"
          rel="noreferrer"
          className={inlineLinkClassName}
        >
          tiebreaks
        </a>
        .
      </>
    ),
  },
  {
    title: "Community Support",
    icon: MessageCircle,
    description: (
      <>
        Visit the Gambit Pairing{" "}
        <a
          href={DISCORD_URL}
          target="_blank"
          rel="noreferrer"
          className={inlineLinkClassName}
        >
          Discord
        </a>{" "}
        or{" "}
        <a
          href={ISSUES_URL}
          target="_blank"
          rel="noreferrer"
          className={inlineLinkClassName}
        >
          GitHub issues
        </a>{" "}
        with questions or problems.
      </>
    ),
  },
  {
    title: "Help & FAQ",
    icon: CircleHelp,
    description: (
      <>
        Find answers to common questions in the{" "}
        <a
          href={DOCUMENTATION_URL}
          target="_blank"
          rel="noreferrer"
          className={inlineLinkClassName}
        >
          documentation
        </a>{" "}
        and{" "}
        <Link href="/#faq" className={inlineLinkClassName}>
          frequently asked questions
        </Link>
        .
      </>
    ),
  },
  {
    title: "Contributing",
    icon: Heart,
    iconClassName: "fill-current",
    description: (
      <>
        Want to give back? Learn how to{" "}
        <a
          href={PULL_REQUESTS_URL}
          target="_blank"
          rel="noreferrer"
          className={inlineLinkClassName}
        >
          contribute
        </a>{" "}
        improvements to Gambit Pairing.
      </>
    ),
  },
]

function ResourceCard({
  resource,
  className,
}: {
  resource: Resource
  className?: string
}) {
  const Icon = resource.icon

  return (
    <article
      className={cn(
        "flex min-h-[260px] flex-col items-center border border-b-4 border-border border-b-[color:var(--download-button)] bg-card px-6 py-8 text-center sm:px-8 sm:py-9",
        className
      )}
    >
      <Icon
        aria-hidden="true"
        className={cn("size-14 text-foreground", resource.iconClassName)}
        strokeWidth={2.1}
      />
      <div className="mt-9 flex flex-col items-center">
        <h3 className="text-xl leading-tight font-bold tracking-tight">
          {resource.title}
        </h3>
        <p className="mt-4 max-w-sm text-base leading-7 text-foreground/80">
          {resource.description}
        </p>
      </div>
    </article>
  )
}

export function DownloadGettingStarted() {
  return (
    <section
      aria-labelledby="getting-started-heading"
      className="mt-14 sm:mt-16"
    >
      <h2
        id="getting-started-heading"
        className="text-2xl leading-tight font-bold tracking-tight sm:text-3xl"
      >
        Getting Started
      </h2>

      <div className="mt-5 grid gap-4 md:grid-cols-6">
        {RESOURCES.slice(0, 3).map((resource) => (
          <ResourceCard
            key={resource.title}
            resource={resource}
            className="md:col-span-2 md:min-h-[286px]"
          />
        ))}
        {RESOURCES.slice(3).map((resource) => (
          <ResourceCard
            key={resource.title}
            resource={resource}
            className="md:col-span-3 md:min-h-[264px]"
          />
        ))}
      </div>
    </section>
  )
}
