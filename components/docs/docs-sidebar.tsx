import Link from "next/link"

import type { DocsNavGroup } from "@/lib/docs/paths"
import { cn } from "@/lib/utils"

export function DocsSidebar({
  groups,
  currentHref,
}: {
  groups: DocsNavGroup[]
  currentHref: string
}) {
  return (
    <nav
      aria-label="Documentation"
      className="lg:sticky lg:top-28 lg:self-start"
    >
      <div className="flex flex-col gap-6">
        {groups.map((group) => (
          <div key={group.folder}>
            {group.label ? (
              <p className="px-3 pb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {group.label}
              </p>
            ) : null}
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const isCurrent = item.href === currentHref

                return (
                  <li key={item.path}>
                    <Link
                      href={item.href}
                      aria-current={isCurrent ? "page" : undefined}
                      className={cn(
                        "block rounded-md px-3 py-1.5 text-sm transition-colors",
                        isCurrent
                          ? "bg-muted font-medium text-foreground"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                      )}
                    >
                      {item.title}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  )
}
