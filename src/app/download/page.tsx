import { getLatestRelease, formatBytes } from "@/lib/github";
import { siteConfig } from "@/lib/config";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Download, ExternalLink, Monitor, Package, Terminal } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Download | Gambit Pairing",
  description: "Download Gambit Pairing for Windows or install via Python.",
};

export default async function DownloadPage() {
  const latestRelease = await getLatestRelease();
  
  // Find Windows asset
  const windowsAsset = latestRelease?.assets.find(asset => 
    asset.name.endsWith('.exe') || asset.name.endsWith('.msi')
  );

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-24">
        <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
            Download Gambit Pairing
          </h1>
          <p className="text-xl text-muted-foreground">
            Get the latest version {latestRelease?.tag_name} for your platform.
          </p>

          <div className="grid gap-6 w-full md:grid-cols-2 mt-8">
            {/* Windows Download Card */}
            <div className="flex flex-col p-6 bg-card border rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 w-fit rounded-full mb-4 mx-auto">
                <Monitor className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Windows</h2>
              <p className="text-muted-foreground mb-6 flex-grow">
                Download the standalone installer for Windows 10/11.
              </p>
              {windowsAsset ? (
                <div className="space-y-3">
                  <Button asChild size="lg" className="w-full gap-2">
                    <a href={windowsAsset.browser_download_url}>
                      <Download className="h-4 w-4" /> Download Installer
                    </a>
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    {windowsAsset.name} • {formatBytes(windowsAsset.size)}
                  </p>
                </div>
              ) : (
                <Button disabled variant="outline" className="w-full">
                  Not available
                </Button>
              )}
            </div>

            {/* Python/PyPI Card */}
            <div className="flex flex-col p-6 bg-card border rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 w-fit rounded-full mb-4 mx-auto">
                <Terminal className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Python Package</h2>
              <p className="text-muted-foreground mb-6 flex-grow">
                Install via pip from the Python Package Index.
              </p>
              <div className="space-y-3">
                <div className="bg-muted p-3 rounded-md font-mono text-sm flex items-center justify-between">
                  <span>pip install gambit-pairing</span>
                  {/* Could add copy button here */}
                </div>
                <Button asChild variant="outline" className="w-full gap-2">
                  <Link href={siteConfig.links.pypi} target="_blank">
                    <ExternalLink className="h-4 w-4" /> View on PyPI
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <p className="text-muted-foreground mb-4">
              Looking for other versions or source code?
            </p>
            <Button asChild variant="ghost">
              <Link href="/releases" className="gap-2">
                <Package className="h-4 w-4" /> View all releases
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
