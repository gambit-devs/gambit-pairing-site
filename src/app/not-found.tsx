"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className={cn("min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6")}>
      <div className="text-center max-w-2xl">
        <h1 className="text-8xl font-black tracking-tighter">404</h1>
        <h2 className="text-2xl font-bold mt-4">Checkmate — Page Not Found.</h2>

        <blockquote className="italic text-muted-foreground border-l-4 border-primary pl-4 py-4 mt-6">
          “The blunders are all there on the board, waiting to be made.”
          <footer className="text-sm font-semibold mt-2">— Savielly Tartakower</footer>
        </blockquote>

        <p className="text-muted-foreground mt-6">Sorry, the page you were looking for was captured by the opponent.</p>

        <div className="flex justify-center gap-4 mt-6">
          <Button asChild variant="default"><Link href="/">Return to Safety</Link></Button>
        </div>
      </div>
    </div>
  );
}


