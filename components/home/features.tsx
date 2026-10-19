import { Picture } from "@/components/media/picture"
import { AspectRatio } from "@/components/ui/aspect-ratio"

const FEATURES = [
  {
    title: "Swiss pairings",
    description: "Create pairings round by round as results come in.",
    screenshot: "/screenshots/tournament.webp",
    alt: "Gambit Pairing tournament screen showing Swiss pairings and result controls",
  },
  {
    title: "Player management",
    description: "Keep players, ratings, and titles organized in one place.",
    screenshot: "/screenshots/player.webp",
    alt: "Gambit Pairing player management screen showing player names, ratings, ages, and status",
  },
  {
    title: "Standings & tiebreaks",
    description:
      "Track results with live standings and familiar tiebreak systems.",
    screenshot: "/screenshots/standings.webp",
    alt: "Gambit Pairing standings screen showing scores and tiebreak values",
  },
  {
    title: "Cross-tables & reports",
    description: "Review every result and prepare clear tournament reports.",
    screenshot: "/screenshots/crosstable.webp",
    alt: "Gambit Pairing cross-table screen showing player results and colors",
  },
] as const

export function Features() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="mt-24 flex w-full justify-center px-6 sm:mt-32"
    >
      <div className="w-full max-w-5xl">
        <div className="text-center">
          <h2
            id="features-heading"
            className="text-3xl leading-tight font-black tracking-tight sm:text-4xl"
          >
            Everything you need.
          </h2>
        </div>

        <div className="mt-12 grid gap-x-12 gap-y-16 sm:grid-cols-2">
          {FEATURES.map(({ title, description, screenshot, alt }) => (
            <article
              key={title}
              className="flex flex-col items-center text-center"
            >
              <figure className="w-full overflow-hidden">
                <AspectRatio ratio="1022/860" className="relative">
                  <Picture
                    src={screenshot}
                    alt={alt}
                    className="absolute inset-0 h-full w-full object-contain"
                  />
                </AspectRatio>
              </figure>
              <h3 className="mt-6 text-lg leading-6 font-bold tracking-tight">
                {title}
              </h3>
              <p className="mt-2 max-w-md text-base leading-6 text-foreground/70">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
