"use client"

import Link from "next/link"

import { buttonVariants } from "@/components/ui/cubby-ui/button"

// buttonVariants comes from a client module, so this link lives in its own
// client component and the server-rendered 404 page renders it.
export function HomeButton() {
  return (
    <Link href="/" className={buttonVariants()}>
      Back to home
    </Link>
  )
}
