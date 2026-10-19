import Link from "next/link"
import rehypeSlug from "rehype-slug"
import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"

import { cn, isExternalUrl } from "@/lib/utils"

type MarkdownProps = {
  source: string
  headingIds?: boolean
  resolveHref?: (href: string) => string
  resolveSrc?: (src: string) => string
  className?: string
}

const linkClassName =
  "text-[color:var(--download-button)] underline-offset-4 transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"

const PULL_REQUEST_URL =
  /^https:\/\/github\.com\/[^/]+\/[^/]+\/(?:pull|issues)\/(\d+)$/

export function Markdown({
  source,
  headingIds = false,
  resolveHref = (href) => href,
  resolveSrc = (src) => src,
  className,
}: MarkdownProps) {
  const components: Components = {
    h1: ({ id, children }) => (
      <h1
        id={id}
        className="mt-10 mb-4 scroll-mt-28 text-3xl font-bold tracking-tight"
      >
        {children}
      </h1>
    ),
    h2: ({ id, children }) => (
      <h2
        id={id}
        className="mt-12 mb-4 scroll-mt-28 text-2xl font-semibold tracking-tight"
      >
        {children}
      </h2>
    ),
    h3: ({ id, children }) => (
      <h3 id={id} className="mt-8 mb-3 scroll-mt-28 text-xl font-semibold">
        {children}
      </h3>
    ),
    h4: ({ id, children }) => (
      <h4 id={id} className="mt-6 mb-2 scroll-mt-28 text-lg font-semibold">
        {children}
      </h4>
    ),
    p: ({ children }) => (
      <p className="my-4 leading-7 text-foreground/80">{children}</p>
    ),
    a: ({ href = "", children }) => {
      const resolved = resolveHref(href)

      if (isExternalUrl(resolved)) {
        const pullRequest = resolved.match(PULL_REQUEST_URL)
        const label =
          pullRequest && String(children) === href
            ? `#${pullRequest[1]}`
            : children

        return (
          <a
            href={resolved}
            target="_blank"
            rel="noreferrer"
            className={linkClassName}
          >
            {label}
          </a>
        )
      }

      if (resolved.startsWith("/")) {
        return (
          <Link href={resolved} className={linkClassName}>
            {children}
          </Link>
        )
      }

      return (
        <a href={resolved} className={linkClassName}>
          {children}
        </a>
      )
    },
    code: ({ className, children }) => (
      <code
        className={cn(
          "rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground",
          className
        )}
      >
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="my-6 overflow-x-auto rounded-lg border border-border bg-muted p-4 text-sm leading-6 [&_code]:bg-transparent [&_code]:p-0">
        {children}
      </pre>
    ),
    ul: ({ children }) => (
      <ul className="my-4 list-disc space-y-2 pl-6 text-foreground/80 marker:text-muted-foreground">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="my-4 list-decimal space-y-2 pl-6 text-foreground/80 marker:text-muted-foreground">
        {children}
      </ol>
    ),
    li: ({ className, children }) => (
      <li
        className={cn(
          "pl-1",
          className === "task-list-item" && "-ml-6 list-none"
        )}
      >
        {children}
      </li>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-2 border-[var(--download-button)] pl-4 text-muted-foreground">
        {children}
      </blockquote>
    ),
    table: ({ children }) => (
      <div className="my-6 overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => (
      <th className="border-b border-border px-3 py-2 font-semibold text-foreground">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border-b border-border px-3 py-2 align-top text-foreground/80">
        {children}
      </td>
    ),
    hr: () => <hr className="my-10 border-border" />,
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    img: ({ src, alt }) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={typeof src === "string" ? resolveSrc(src) : undefined}
        alt={alt ?? ""}
        className="my-6 rounded-lg border border-border"
      />
    ),
  }

  return (
    <div className={cn("min-w-0", className)}>
      <ReactMarkdown
        components={components}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={headingIds ? [rehypeSlug] : []}
      >
        {source}
      </ReactMarkdown>
    </div>
  )
}
