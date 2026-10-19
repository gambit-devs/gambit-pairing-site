import type { Metadata } from "next"
import Link from "next/link"

import GalleryViewer from "@/components/gallery/gallery-viewer"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteNavigation } from "@/components/navigation/site-navigation"
import { FancyText } from "@/components/ui/fancy-text"
import { getLatestRelease } from "@/lib/github/client"

export const metadata: Metadata = {
  title: "Gallery Modal",
  description:
    "A Framer Motion gallery modal component with images that open in an interactive modal on click, offering a smooth and immersive viewing experience. Features responsive design, smooth animations, and elegant image presentation for modern photo galleries.",
  keywords: [
    "Gallery modals component",
    "Framer Motion gallery",
    "Image modal gallery",
    "React gallery modal",
    "Interactive image gallery",
    "Modal image viewer",
    "Gallery lightbox component",
    "Image lightbox modal",
    "Photo gallery modal",
    "Gallery popup component",
    "Image viewer component",
    "Modal gallery slider",
    "Responsive gallery modal",
    "Gallery with modal",
    "Image overlay component",
    "Photo viewer modal",
    "Gallery modal animations",
    "Interactive photo gallery",
    "Image gallery component",
    "Modal image gallery",
    "Gallery transitions",
    "Image popup modal",
    "Photo lightbox component",
    "Gallery modal viewer",
    "Image carousel modal",
    "Gallery zoom modal",
    "Modern gallery component",
    "Smooth gallery animations",
    "Gallery modal effects",
    "Custom gallery modal",
    "UI gallery component",
    "Image gallery modal",
    "Gallery modal interface",
    "Photo gallery component",
    "Tailwind gallery modal",
  ],
  alternates: {
    canonical: "/gallery",
  },
}

export default async function GalleryPage() {
  const latestRelease = await getLatestRelease()

  return (
    <main className="flex min-h-svh flex-col pt-8">
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

      <section className="mx-auto w-full max-w-[1600px] px-4 pt-14 pb-16 sm:px-8 sm:pt-20 lg:px-12">
        <GalleryViewer />
      </section>

      <SiteFooter />
    </main>
  )
}
