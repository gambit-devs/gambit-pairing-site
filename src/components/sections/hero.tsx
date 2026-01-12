"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Github } from "lucide-react";
import { useState, useEffect } from "react";

import { siteConfig } from "@/lib/config";
import { getLatestRelease } from "@/lib/github";

export function Hero() {
  const [latestVersion, setLatestVersion] = useState<string>("Latest Version");

  useEffect(() => {
    const fetchLatestVersion = async () => {
      try {
        const release = await getLatestRelease();
        if (release) {
          const tag = release.tag_name.startsWith('v') ? release.tag_name.slice(1) : release.tag_name;
          const versionParts = tag.split('.');
          const displayVersion = versionParts.length >= 2 ? `${versionParts[0]}.${versionParts[1]}` : tag;
          setLatestVersion(`v${displayVersion}`);
        }
      } catch (error) {
        console.error("Failed to fetch latest release:", error);
      }
    };

    fetchLatestVersion();
  }, []);

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/photos/chess.jpg"
          alt="Chess Board Background"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-background/90 dark:bg-background/80 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/50 to-background" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                {latestVersion} Now Available
              </div>
              <div className="inline-block rounded-lg border border-primary/20 bg-background/50 backdrop-blur-sm px-3 py-1 text-sm text-muted-foreground">
                Open Source & Free
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 pb-2">
              {siteConfig.name}
            </h1>
            <p className="text-xl md:text-2xl font-medium text-muted-foreground max-w-[800px] mx-auto">
              The ultimate Swiss tournament pairing software for chess organizers.
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-[700px] text-lg text-muted-foreground/80"
          >
            {siteConfig.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Button asChild size="lg" className="gap-2 min-w-[160px]">
              <Link href="/download">
                Download Now <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2 min-w-[160px] bg-background/50 backdrop-blur-sm">
              <Link href={siteConfig.links.github} target="_blank">
                <Github className="h-4 w-4" /> View on GitHub
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
