"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 pl-4">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/designs/navbar.png"
              alt="Gambit Pairing"
              width={192}
              height={48}
              className="h-12 w-auto"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/#features" className="text-sm font-medium hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="/#screenshots" className="text-sm font-medium hover:text-primary transition-colors">
            Screenshots
          </Link>
          <Link href="/releases" className="text-sm font-medium hover:text-primary transition-colors">
            Releases
          </Link>
          <Link href="/docs" className="text-sm font-medium hover:text-primary transition-colors">
            Docs
          </Link>
          <Button asChild variant="default" size="sm">
            <Link href="/download">Download</Link>
          </Button>
        </nav>

        {/* Mobile Navigation Toggle */}
        <button
          className="md:hidden p-2 z-50 relative"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

    </header>

      {/* Mobile Menu (fixed outside the header to overlay everything) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] bg-white md:hidden"
          >
            <button
              className="absolute top-5 right-5 p-2 rounded-md hover:bg-background/5 transition-colors z-[10000]"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="flex flex-col items-center justify-center min-h-screen px-6">
              {/* Logo */}
              <div className="mb-12">
                <Image
                  src="/designs/navbar.png"
                  alt="Gambit Pairing"
                  width={192}
                  height={48}
                  className="h-12 w-auto"
                />
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col items-center space-y-8 text-xl font-medium">
                <Link
                  href="/#features"
                  className="hover:text-primary transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Features
                </Link>
                <Link
                  href="/#screenshots"
                  className="hover:text-primary transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Screenshots
                </Link>
                <Link
                  href="/releases"
                  className="hover:text-primary transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Releases
                </Link>
                <Link
                  href="/docs"
                  className="hover:text-primary transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Documentation
                </Link>
              </nav>

              {/* Download Button */}
              <div className="mt-12">
                <Button asChild variant="default" size="lg" className="px-8">
                  <Link href="/download" onClick={() => setIsOpen(false)}>Download</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
