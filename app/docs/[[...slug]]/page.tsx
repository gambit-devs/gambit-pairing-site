import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { DocsSidebar } from "@/components/docs/docs-sidebar"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteNavigation } from "@/components/navigation/site-navigation"
import { Markdown } from "@/components/markdown/markdown"
import { FancyText } from "@/components/ui/fancy-text"
import {
  buildDocsNav,
  docHref,
  findDocPage,
  resolveDocAssetSrc,
  resolveDocLink,
} from "@/lib/docs/paths"
import { getDocsPages } from "@/lib/docs/source"
import { getLatestRelease } from "@/lib/github/client"
import { USER_DOCS_BRANCH, USER_DOCS_REPOSITORY_URL } from "@/lib/site/config"

type DocsRouteProps = PageProps<"/docs/[[...slug]]">

export async function generateStaticParams() {
  const pages = await getDocsPages()

  return pages.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: DocsRouteProps): Promise<Metadata> {
  const { slug = [] } = await params
  const page = findDocPage(await getDocsPages(), slug)

  if (!page || slug.length === 0) {
    return { title: "Documentation" }
  }

  return {
    title: page.title,
    alternates: {
      canonical: docHref(slug),
    },
  }
}

export default async function DocsRoute({ params }: DocsRouteProps) {
  const { slug = [] } = await params
  const [pages, latestRelease] = await Promise.all([
    getDocsPages(),
    getLatestRelease(),
  ])
  const page = findDocPage(pages, slug)

  if (!page) {
    notFound()
  }

  const docPaths = new Set(pages.map(({ path }) => path))

  return (
    <main className="flex min-h-svh flex-col bg-background pt-8 text-foreground">
      <header className="flex flex-col items-center gap-8">
        <Link href="/" aria-label="Gambit Pairing home">
          <FancyText
            className="text-center text-5xl leading-none font-black text-foreground/10"
            fillClassName="text-foreground"
          >
            Gambit Pairing
          </FancyText>
        </Link>
        <SiteNavigation latestVersion={latestRelease.version} />
      </header>

      <div className="mx-auto mt-12 grid w-full max-w-6xl gap-10 px-6 pb-20 sm:mt-16 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
        <DocsSidebar groups={buildDocsNav(pages)} currentHref={docHref(slug)} />

        <article className="max-w-3xl min-w-0">
          <Markdown
            source={page.markdown}
            headingIds
            resolveHref={(href) =>
              resolveDocLink(href, { fromPath: page.path, docPaths })
            }
            resolveSrc={(src) => resolveDocAssetSrc(src, page.path)}
          />
          <p className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground">
            <a
              href={`${USER_DOCS_REPOSITORY_URL}/edit/${USER_DOCS_BRANCH}/${page.path}`}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4 transition-colors hover:text-foreground"
            >
              Contribute to this page
            </a>
          </p>
        </article>
      </div>

      <SiteFooter />
    </main>
  )
}
