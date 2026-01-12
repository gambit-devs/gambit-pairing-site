import { getReleases, formatBytes } from "@/lib/github";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Download, ExternalLink, Calendar, Tag, Package } from "lucide-react";
import { Metadata } from "next";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Releases | Gambit Pairing",
  description: "Download the latest versions of Gambit Pairing.",
};

export default async function ReleasesPage() {
  const releases = await getReleases();

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Releases</h1>
            <p className="text-muted-foreground">
              History of versions and downloadable assets.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href={`${siteConfig.links.github}/releases`} target="_blank">
              View on GitHub <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="space-y-8">
          {releases.map((release) => (
            <div key={release.id} className="border rounded-lg p-6 shadow-sm bg-card">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-primary">
                      {release.name || release.tag_name}
                    </h2>
                    {release.prerelease && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        Pre-release
                      </span>
                    )}
                    {release.draft && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                        Draft
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      {release.tag_name}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(release.published_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="prose dark:prose-invert max-w-none mb-6 text-sm text-muted-foreground whitespace-pre-wrap">
                {release.body}
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Package className="h-4 w-4" /> Assets
                </h3>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {release.assets.map((asset) => (
                    <a
                      key={asset.id}
                      href={asset.browser_download_url}
                      className="flex items-center justify-between p-3 rounded-md border bg-background hover:bg-accent hover:text-accent-foreground transition-colors group"
                    >
                      <div className="flex flex-col overflow-hidden">
                        <span className="font-medium truncate text-sm" title={asset.name}>
                          {asset.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatBytes(asset.size)}
                        </span>
                      </div>
                      <Download className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                    </a>
                  ))}
                  <a
                    href={release.html_url}
                    target="_blank"
                    className="flex items-center justify-between p-3 rounded-md border border-dashed hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <span className="font-medium text-sm">Source code</span>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
