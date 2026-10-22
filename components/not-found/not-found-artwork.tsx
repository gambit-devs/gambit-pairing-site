"use client"

import { useEffect, useState } from "react"

import { Picture } from "@/components/media/picture"

// Every piece uses the same box, so the page does not shift when one is
// picked. Each piece is centered inside it.
const PIECE_CLASS_NAME =
  "absolute bottom-0 left-1/2 h-full w-auto -translate-x-1/2"

// Each configuration is one piece shown on its own.
const PIECES = [
  "/photos/pawn-dreaming-white.webp",
  "/photos/white-pawn-2.webp",
  "/photos/rook-hiding-white.webp",
]

export function NotFoundArtwork() {
  const [piece, setPiece] = useState<string | null>(null)

  useEffect(() => {
    // The pick happens after hydration, so the static page is the same on
    // every visit and each visit still gets a random piece.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPiece(PIECES[Math.floor(Math.random() * PIECES.length)])
  }, [])

  return (
    <div className="relative mx-auto h-64 w-72 sm:h-80 sm:w-96">
      {piece && (
        <Picture src={piece} alt="" priority className={PIECE_CLASS_NAME} />
      )}
    </div>
  )
}
