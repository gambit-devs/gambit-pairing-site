export type GalleryItem = {
  id: number
  url: string
  title: string
  tags?: string[]
  description: string
}

export const items: GalleryItem[] = [
  {
    id: 1,
    url: "/screenshots/tournament.webp",
    title: "Tournament overview",
    tags: ["Gambit Pairing"],
    description: "The tournament screen with pairings and result controls.",
  },
  {
    id: 2,
    url: "/screenshots/manual.webp",
    title: "Swiss pairings",
    tags: ["Pairings"],
    description: "Editing a round's pairings, placing players on boards.",
  },
  {
    id: 3,
    url: "/screenshots/standings.webp",
    title: "Standings & tiebreaks",
    tags: ["Standings"],
    description: "Live standings with scores and tiebreak values.",
  },
  {
    id: 4,
    url: "/screenshots/player.webp",
    title: "Player management",
    tags: ["Players"],
    description: "Player list with names, ratings, ages, and status.",
  },
  {
    id: 5,
    url: "/screenshots/crosstable.webp",
    title: "Cross-tables & reports",
    tags: ["Reports"],
    description: "Every player's results and colors in one cross-table.",
  },
  {
    id: 6,
    url: "/screenshots/tournament.webp",
    title: "Tournament overview",
    tags: ["Gambit Pairing"],
    description: "The tournament screen with pairings and result controls.",
  },
  {
    id: 7,
    url: "/screenshots/manual.webp",
    title: "Swiss pairings",
    tags: ["Pairings"],
    description: "Editing a round's pairings, placing players on boards.",
  },
  {
    id: 8,
    url: "/screenshots/standings.webp",
    title: "Standings & tiebreaks",
    tags: ["Standings"],
    description: "Live standings with scores and tiebreak values.",
  },
  {
    id: 9,
    url: "/screenshots/player.webp",
    title: "Player management",
    tags: ["Players"],
    description: "Player list with names, ratings, ages, and status.",
  },
  {
    id: 10,
    url: "/screenshots/crosstable.webp",
    title: "Cross-tables & reports",
    tags: ["Reports"],
    description: "Every player's results and colors in one cross-table.",
  },
  {
    id: 11,
    url: "/screenshots/history_log.webp",
    title: "Round results",
    tags: ["Results"],
    description: "The history log of results for every round.",
  },
  {
    id: 12,
    url: "/screenshots/app.webp",
    title: "Tournament setup",
    tags: ["Setup"],
    description: "The empty tournament screen before anything is loaded.",
  },
  {
    id: 13,
    url: "/screenshots/print_dialog.webp",
    title: "Printing",
    tags: ["Printing"],
    description: "The print dialog for tournament reports.",
  },
  {
    id: 14,
    url: "/screenshots/history_log.webp",
    title: "Round history",
    tags: ["Rounds"],
    description: "The history log of results for every round.",
  },
]
