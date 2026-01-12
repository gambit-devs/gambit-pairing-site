"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const screenshots = [
  { src: "/screenshots/1.png", alt: "Screenshot 1", title: "Screenshot 1" },
  { src: "/screenshots/2.png", alt: "Screenshot 2", title: "Screenshot 2" },
  { src: "/screenshots/3.png", alt: "Screenshot 3", title: "Screenshot 3" },
];

export function Screenshots() {
  const [active, setActive] = useState(0);

  return (
    <section id="screenshots" className="py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Screenshots
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Take a look inside the application.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-center">
          {/* Main Preview */}
          <div className="w-full lg:w-3/4 relative aspect-video bg-muted rounded-lg overflow-hidden shadow-xl border">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0"
              >
                <Image
                  src={screenshots[active].src}
                  alt={screenshots[active].alt}
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Thumbnails */}
          <div className="w-full lg:w-1/4 flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible p-2">
            {screenshots.map((shot, index) => (
              <button
                key={index}
                onClick={() => setActive(index)}
                className={cn(
                  "relative flex-shrink-0 w-32 lg:w-full aspect-video rounded-md overflow-hidden border-2 transition-all",
                  active === index ? "border-primary ring-2 ring-primary/20" : "border-transparent opacity-70 hover:opacity-100"
                )}
              >
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
