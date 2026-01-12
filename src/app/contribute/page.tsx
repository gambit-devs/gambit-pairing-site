import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Github, Bug, GitPullRequest, MessageSquare } from "lucide-react";
import { siteConfig } from "@/lib/config";

export default function ContributePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1 py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl mb-4">
              Contribute to {siteConfig.name}
            </h1>
            <p className="text-xl text-muted-foreground">
              Help us make the best open-source chess pairing software.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 mb-12">
            <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Bug className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Report Issues</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Found a bug or have a feature request? Open an issue on GitHub to let us know.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href={`${siteConfig.links.github}/issues`} target="_blank">
                  View Issues
                </Link>
              </Button>
            </div>

            <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <GitPullRequest className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Submit Code</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Ready to write some code? Fork the repository and submit a Pull Request.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href={`${siteConfig.links.github}/pulls`} target="_blank">
                  View Pull Requests
                </Link>
              </Button>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none text-center">
            <h2>Getting Started</h2>
            <p>
              We welcome contributions of all kinds! Whether you're fixing bugs, improving documentation, or adding new features, your help is appreciated.
            </p>
            <p>
              For detailed instructions on setting up your development environment, coding standards, and submission guidelines, please refer to our developer documentation.
            </p>
            <div className="not-prose mt-8">
              <Button asChild size="lg">
                <Link href="/docs">
                  Read Developer Documentation
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="mt-12 text-center">
             <Button asChild size="lg" className="gap-2">
              <Link href={siteConfig.links.github} target="_blank">
                <Github className="h-5 w-5" />
                Star on GitHub
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
