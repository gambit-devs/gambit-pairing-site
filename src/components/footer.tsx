import Link from "next/link";
import { Github, Package } from "lucide-react";
import { siteConfig } from "@/lib/config";

export function Footer() {
  return (
    <footer className="border-t py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <span className="text-xl font-bold text-primary">{siteConfig.name}</span>
          <p className="text-sm text-muted-foreground">
            {siteConfig.description}
          </p>
          <div className="flex gap-4">
            <Link href={siteConfig.links.github} target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link href={siteConfig.links.pypi} target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
              <Package className="h-5 w-5" />
              <span className="sr-only">PyPI</span>
            </Link>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-4">Product</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/#features" className="hover:text-primary transition-colors">Features</Link></li>
            <li><Link href="/#screenshots" className="hover:text-primary transition-colors">Screenshots</Link></li>
            <li><Link href="/download" className="hover:text-primary transition-colors">Download</Link></li>
            <li><Link href="/releases" className="hover:text-primary transition-colors">Releases</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Resources</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/docs" className="hover:text-primary transition-colors">Documentation</Link></li>
            <li><Link href="/#faq" className="hover:text-primary transition-colors">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Community</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href={siteConfig.links.githubOrg} target="_blank" className="hover:text-primary transition-colors">GitHub</Link></li>
            <li><Link href="/contribute" className="hover:text-primary transition-colors">Contribute</Link></li>
            <li><Link href={`${siteConfig.links.github}/issues`} target="_blank" className="hover:text-primary transition-colors">Report an Issue</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} {siteConfig.github.owner}. Open Source under MIT License.</p>
      </div>
    </footer>
  );
}
