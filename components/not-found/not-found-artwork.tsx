"use client"

import { useEffect, useState } from "react"

import { Picture } from "@/components/media/picture"

type Piece = {
  src: string
  className: string
}

const SINGLE_PIECE_CLASS_NAME = "h-64 w-auto sm:h-80"

// Each configuration is one set of pieces. The pawn in the first one is
// mirrored so it faces the rook.
const CONFIGURATIONS: Piece[][] = [
  [
    {
      src: "/photos/white-pawn-2-flipped.webp",
      className: "h-48 w-auto sm:h-60",
    },
    {
      src: "/photos/rook-hiding-white.webp",
      className: SINGLE_PIECE_CLASS_NAME,
    },
  ],
  [
    {
      src: "/photos/pawn-dreaming-white.webp",
      className: SINGLE_PIECE_CLASS_NAME,
    },
  ],
  [
    {
      src: "/photos/rook-hiding-white.webp",
      className: SINGLE_PIECE_CLASS_NAME,
    },
  ],
]

export function NotFoundArtwork() {
  const [configuration, setConfiguration] = useState<Piece[] | null>(null)

  useEffect(() => {
    // The pick happens after hydration, so the static page is the same on
    // every visit and each visit still gets a random configuration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConfiguration(
      CONFIGURATIONS[Math.floor(Math.random() * CONFIGURATIONS.length)]
    )
  }, [])

  return (
    <div className="flex h-64 items-end justify-center gap-2 sm:h-80">
      {configuration?.map((piece) => (
        <Picture
          key={piece.src}
          src={piece.src}
          alt=""
          priority
          className={piece.className}
        />
      ))}
    </div>
  )
}
