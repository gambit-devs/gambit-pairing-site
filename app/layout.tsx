import type { Metadata } from "next"
import localFont from "next/font/local"

import "./globals.css"
import { ThemeProvider } from "@/components/layout/theme-provider"
import { ORGANIZATION_URL, SITE_URL } from "@/lib/site/config"
import { serializeJsonLd } from "@/lib/site/json-ld"
import { cn } from "@/lib/utils"

const geist = localFont({
  src: "./fonts/Geist-latin.woff2",
  variable: "--font-sans",
  display: "swap",
  weight: "100 900",
})

const fontMono = localFont({
  src: "./fonts/GeistMono-latin.woff2",
  variable: "--font-mono",
  display: "swap",
  weight: "100 900",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Gambit Pairing | Swiss Tournament Manager",
    template: "%s | Gambit Pairing",
  },
  description:
    "Free, open-source Swiss tournament pairing software for chess organizers. Run fair tournaments on Windows, macOS, or Linux.",
  keywords: [
    "Swiss chess pairing software",
    "free chess tournament software",
    "chess tournament manager",
    "Swiss-system pairing",
    "tournament director software",
    "GPLv3 chess software",
  ],
  authors: [{ name: "Gambit Devs" }],
  creator: "Gambit Pairing",
  publisher: "Gambit Devs",
  category: "Chess tournament software",
  alternates: {
    canonical: "/",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Gambit Pairing | Swiss Tournament Manager",
    description:
      "Free, open-source Swiss tournament pairing software for chess organizers.",
    url: SITE_URL,
    siteName: "Gambit Pairing",
    images: [
      {
        url: "/designs/social.webp",
        width: 1200,
        height: 630,
        alt: "Gambit Pairing — free Swiss tournament pairing software",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gambit Pairing | Swiss Tournament Manager",
    description:
      "Free, open-source Swiss tournament pairing software for chess organizers.",
    images: ["/designs/social.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: {
      url: "/icons/icon.webp",
      type: "image/webp",
      sizes: "1024x1024",
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body>
        <ThemeProvider>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: serializeJsonLd({
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                name: "Gambit Pairing",
                description:
                  "Free, open-source Swiss tournament pairing software for chess organizers.",
                url: SITE_URL,
                applicationCategory: "SportsApplication",
                operatingSystem: "Windows, macOS, Linux",
                license: "https://www.gnu.org/licenses/gpl-3.0.html",
                offers: {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "USD",
                  availability: "https://schema.org/InStock",
                },
                author: {
                  "@type": "Organization",
                  name: "Gambit Devs",
                  url: ORGANIZATION_URL,
                },
              }),
            }}
          />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
