import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://gambit-devs.org"),
  title: "Gambit Pairing | Swiss Tournament Manager",
  description: "Free Swiss tournament pairing software for chess organizers. Easy-to-use, powerful features for managing chess tournaments efficiently. Download now!",
  keywords: ["chess tournament", "Swiss pairing", "tournament manager", "chess software", "pairing algorithm"],
  authors: [{ name: "Gambit Pairing Team" }],
  creator: "Gambit Pairing",
  publisher: "Gambit Pairing",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Gambit Pairing | Swiss Tournament Manager",
    description: "Free Swiss tournament pairing software for chess organizers. Easy-to-use, powerful features for managing chess tournaments efficiently.",
    url: "https://gambit-devs.org",
    siteName: "Gambit Pairing",
    images: [
      {
        url: "/designs/social.webp",
        width: 1200,
        height: 630,
        alt: "Gambit Pairing - Swiss Tournament Manager",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gambit Pairing | Swiss Tournament Manager",
    description: "Free Swiss tournament pairing software for chess organizers. Easy-to-use, powerful features for managing chess tournaments efficiently.",
    images: ["/designs/social.webp"],
    creator: "@gambitpairing",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: '/icons/icon.webp',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Gambit Pairing",
              "description": "Free Swiss tournament pairing software for chess organizers. Easy-to-use, powerful features for managing chess tournaments efficiently.",
              "url": "https://gambit-devs.org",
              "applicationCategory": "SportsApplication",
              "operatingSystem": "Windows, macOS, Linux",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Organization",
                "name": "Gambit Pairing Team"
              }
            }),
          }}
        />
      </head>
      <body className={cn(inter.className, "min-h-screen bg-background font-sans antialiased")}>
        {children}
      </body>
    </html>
  );
}
