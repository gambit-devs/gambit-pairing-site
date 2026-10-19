import { ArrowRight } from "lucide-react"
import Link from "next/link"

const DIVIDER_CLASS_NAME =
  "flex items-center gap-4 py-2 text-sm font-medium text-muted-foreground"

function DividerContent({ showArrow }: { showArrow: boolean }) {
  return (
    <>
      <span aria-hidden="true" className="h-px flex-1 bg-border" />
      <span className="flex items-center gap-1.5">
        Previous releases
        {showArrow ? (
          <ArrowRight aria-hidden="true" className="size-4" />
        ) : null}
      </span>
      <span aria-hidden="true" className="h-px flex-1 bg-border" />
    </>
  )
}

// Links keep the scroll position so the older releases appear where the button was.
export function PreviousReleasesDivider({ href }: { href?: string }) {
  if (href) {
    return (
      <Link
        href={href}
        scroll={false}
        className={`${DIVIDER_CLASS_NAME} transition-colors hover:text-foreground`}
      >
        <DividerContent showArrow />
      </Link>
    )
  }

  return (
    <h2 className={DIVIDER_CLASS_NAME}>
      <DividerContent showArrow={false} />
    </h2>
  )
}
