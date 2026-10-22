"use client"

import { ArrowUpRight, BookOpen } from "lucide-react"
import Image from "next/image"
import { useEffect, useState, type ComponentType, type SVGProps } from "react"

import { DISCORD_URL, REPOSITORY_URL, SITE_ANCHORS } from "@/lib/site/config"
import { cn } from "@/lib/utils"

import {
  MotionNavigationMenu,
  MotionNavigationMenuContent,
  MotionNavigationMenuItem,
  MotionNavigationMenuLink,
  MotionNavigationMenuList,
  MotionNavigationMenuTrigger,
} from "@/components/ui/motion-navigation-menu"

interface SiteNavigationProps {
  latestVersion: string
  viewport?: boolean
}

type ProductLink = {
  title: string
  desc: string
  href: string
  tone?: "discord" | "github"
  icon?: ComponentType<SVGProps<SVGSVGElement>>
}

function DiscordIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.873-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.927 1.795 8.18 1.795 12.061 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127c-.598.35-1.22.648-1.873.892a.077.077 0 0 0-.041.107c.36.698.77 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.9 19.9 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.548-13.66a.061.061 0 0 0-.032-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.974 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418z" />
    </svg>
  )
}

function GitHubIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.084-.729.084-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.809 1.304 3.495.997.108-.776.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.63-5.373-12-12-12" />
    </svg>
  )
}

const PRODUCTS: ProductLink[] = [
  {
    title: "Screenshots",
    desc: "See Gambit Pairing in action.",
    href: "/gallery",
  },
  {
    title: "Discord",
    desc: "Join the Gambit Pairing community.",
    href: DISCORD_URL,
    tone: "discord",
    icon: DiscordIcon,
  },
  {
    title: "GitHub",
    desc: "View the source and contribute.",
    href: REPOSITORY_URL,
    tone: "github",
    icon: GitHubIcon,
  },
]

const RESOURCES: ProductLink[] = [
  {
    title: "Documentation",
    desc: "Guides and API reference.",
    href: SITE_ANCHORS.docs,
  },
  {
    title: "Changelog",
    desc: "What shipped this month.",
    href: SITE_ANCHORS.changelog,
  },
  {
    title: "Contributing",
    desc: "Learn how to contribute to Gambit Pairing.",
    href: "/contributing",
  },
]

const productToneClassNames = {
  discord:
    "bg-[#5865f2] text-white data-[active=true]:text-white hover:bg-[#4752c4] hover:text-white focus:bg-[#4752c4] focus:text-white",
  github:
    "bg-[#24292f] text-white data-[active=true]:text-white hover:bg-[#1f2328] hover:text-white focus:bg-[#1f2328] focus:text-white",
} as const

const menuCardHoverClassName = "hover:brightness-95 focus:brightness-95"

const highlightClassName = "dark:bg-accent bg-foreground/[0.06] rounded-lg"

export function SiteNavigation({
  latestVersion,
  viewport,
}: SiteNavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const updateScrollState = () => {
      const nextIsScrolled = window.scrollY > 8

      setIsScrolled((currentIsScrolled) =>
        currentIsScrolled === nextIsScrolled
          ? currentIsScrolled
          : nextIsScrolled
      )
    }

    updateScrollState()
    window.addEventListener("scroll", updateScrollState, { passive: true })

    return () => window.removeEventListener("scroll", updateScrollState)
  }, [])

  return (
    <div className="sticky top-6 z-40 flex w-full justify-center px-4 sm:px-6">
      <div className="relative flex w-fit items-center justify-center">
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute -inset-x-2 -inset-y-2 z-0 rounded-xl border border-border/80 bg-background/95 backdrop-blur-md transition-opacity duration-200 ease-out sm:-inset-x-3",
            isScrolled ? "opacity-100" : "opacity-0"
          )}
        />
        <div className="relative z-10">
          <MotionNavigationMenu
            viewport={viewport}
            viewportClassName="bg-card border-border rounded-xl ring-0"
          >
            <MotionNavigationMenuList>
              <MotionNavigationMenuItem value="products">
                <MotionNavigationMenuTrigger>
                  Product
                </MotionNavigationMenuTrigger>
                <MotionNavigationMenuContent
                  highlightClassName={highlightClassName}
                >
                  {/* Shrinks to fit phone screens; desktop keeps the full 500px. */}
                  <div className="grid w-[min(500px,calc(100vw-2.25rem))] grid-cols-[1fr_1.25fr] gap-2">
                    <MotionNavigationMenuLink
                      href={SITE_ANCHORS.latestRelease}
                      highlight={false}
                      className={cn(
                        "relative min-h-44 justify-between overflow-hidden rounded-lg bg-card p-4",
                        menuCardHoverClassName
                      )}
                    >
                      <span className="flex flex-col gap-1">
                        <span className="block text-sm font-medium">
                          Latest release
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          Check out the version {latestVersion} changelog.
                        </span>
                      </span>
                      <Image
                        src="/icons/icon.webp"
                        alt=""
                        aria-hidden="true"
                        width={128}
                        height={128}
                        className="pointer-events-none absolute -right-6 -bottom-10 size-32 opacity-[0.15]"
                      />
                    </MotionNavigationMenuLink>
                    <div className="grid grid-cols-2 gap-0.5">
                      {PRODUCTS.map((product) => {
                        const Icon = product.icon

                        return (
                          <MotionNavigationMenuLink
                            key={product.title}
                            href={product.href}
                            highlight={false}
                            className={cn(
                              "relative overflow-hidden",
                              product.title === "Screenshots" && "col-span-2",
                              product.tone
                                ? productToneClassNames[product.tone]
                                : cn(
                                    "bg-muted text-foreground",
                                    menuCardHoverClassName
                                  )
                            )}
                          >
                            {Icon && (
                              <Icon
                                aria-hidden="true"
                                className={cn(
                                  "pointer-events-none absolute -right-3 -bottom-5 z-0 size-16",
                                  product.tone
                                    ? "text-white opacity-20"
                                    : "text-foreground opacity-10"
                                )}
                              />
                            )}
                            <span className="relative z-10 flex items-center justify-between gap-2 text-sm font-medium">
                              {product.title}
                              <ArrowUpRight className="size-3" />
                            </span>
                            <span
                              className={cn(
                                "relative z-10 text-xs",
                                !product.tone && "text-muted-foreground"
                              )}
                            >
                              {product.desc}
                            </span>
                          </MotionNavigationMenuLink>
                        )
                      })}
                    </div>
                  </div>
                </MotionNavigationMenuContent>
              </MotionNavigationMenuItem>

              <MotionNavigationMenuItem value="resources">
                <MotionNavigationMenuTrigger>
                  Resources
                </MotionNavigationMenuTrigger>
                <MotionNavigationMenuContent
                  highlightClassName={highlightClassName}
                >
                  <div className="flex w-[min(320px,calc(100vw-2.25rem))] flex-col gap-0.5">
                    {RESOURCES.map((resource) => (
                      <MotionNavigationMenuLink
                        key={resource.title}
                        href={resource.href}
                      >
                        <span className="flex items-center gap-2 text-sm font-medium">
                          <BookOpen className="size-3.5" />
                          {resource.title}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {resource.desc}
                        </span>
                      </MotionNavigationMenuLink>
                    ))}
                  </div>
                </MotionNavigationMenuContent>
              </MotionNavigationMenuItem>

              <MotionNavigationMenuItem>
                <MotionNavigationMenuLink
                  href={SITE_ANCHORS.downloads}
                  highlight={false}
                  className="relative flex h-9 items-center rounded-md bg-accent px-4 py-2 pr-8 text-sm font-medium text-accent-foreground hover:bg-[color-mix(in_oklch,var(--accent),var(--foreground)_8%)] focus:bg-[color-mix(in_oklch,var(--accent),var(--foreground)_8%)]"
                >
                  Download
                  <ArrowUpRight
                    aria-hidden="true"
                    className="pointer-events-none absolute top-2 right-2 size-3"
                  />
                </MotionNavigationMenuLink>
              </MotionNavigationMenuItem>
            </MotionNavigationMenuList>
          </MotionNavigationMenu>
        </div>
      </div>
    </div>
  )
}

export default SiteNavigation
