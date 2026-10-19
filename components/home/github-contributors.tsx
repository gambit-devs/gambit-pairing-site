import Image from "next/image"

import type { GitHubContributor } from "@/lib/github/types"

type GitHubContributorsProps = {
  contributors: GitHubContributor[]
}

export function GitHubContributors({ contributors }: GitHubContributorsProps) {
  return (
    <section
      aria-labelledby="contributors-heading"
      className="flex w-full max-w-3xl flex-col items-center gap-5 px-8 pb-10"
    >
      <h2
        id="contributors-heading"
        className="text-xl font-bold tracking-tight text-foreground"
      >
        Contributors
      </h2>
      <div className="flex items-center justify-center gap-4">
        {contributors.slice(0, 2).map((contributor) => {
          const displayName = contributor.name || contributor.login

          return (
            <a
              key={contributor.login}
              href={contributor.githubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Visit ${displayName}'s GitHub profile`}
              className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <Image
                src={contributor.avatarUrl}
                alt={`${displayName} GitHub avatar`}
                width={80}
                height={80}
                sizes="80px"
                className="size-20 rounded-full object-cover"
              />
            </a>
          )
        })}
      </div>
    </section>
  )
}
