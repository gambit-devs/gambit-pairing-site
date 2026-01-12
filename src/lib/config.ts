export const siteConfig = {
  name: "Gambit Pairing",
  description: "Fast, fair, and modern tournament management",
  url: "https://gambit-pairing.com", // Placeholder
  links: {
    github: "https://github.com/gambit-devs/gambit-pairing",
    githubOrg: "https://github.com/gambit-devs",
    pypi: "https://pypi.org/org/gambit-pairing/",
    docs: "/docs",
  },
  github: {
    owner: "gambit-devs",
    repo: "gambit-pairing",
    userDocsRepo: "user_documentation",
  },
};

export type SiteConfig = typeof siteConfig;
