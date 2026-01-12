import { siteConfig } from "./config";

export interface DocPage {
  content: string;
  path: string;
}

export interface DocFile {
  name: string;
  path: string;
  type: "file" | "dir";
  download_url?: string;
}

export async function getDocFiles(type: "user" | "dev" = "dev"): Promise<DocFile[]> {
  const repo = type === "user" ? siteConfig.github.userDocsRepo : siteConfig.github.repo;
  // For user docs, we assume files are in root or docs folder. Let's try root first as it's a dedicated repo.
  // Actually, for consistency, let's assume they might be in root.
  // But wait, if it's a dedicated repo, maybe we just fetch root contents?
  // Let's try fetching root contents for user docs, and docs/ for dev docs.
  const path = type === "user" ? "" : "docs";
  
  try {
    const response = await fetch(
      `https://api.github.com/repos/${siteConfig.github.owner}/${repo}/contents/${path}`,
      { 
        next: { revalidate: 3600 },
        headers: {
          'User-Agent': 'Gambit-Pairing-Site-Builder'
        }
      }
    );

    if (!response.ok) {
      console.error(`Failed to fetch ${type} docs files:`, response.statusText);
      return [];
    }

    const files: DocFile[] = await response.json();
    return files.filter(file => file.type === "file" && file.name.endsWith(".md"));
  } catch (error) {
    console.error(`Error fetching ${type} docs files:`, error);
    return [];
  }
}

export async function getDocContent(slug: string[] = [], type: "user" | "dev" = "dev"): Promise<string | null> {
  const repo = type === "user" ? siteConfig.github.userDocsRepo : siteConfig.github.repo;
  const basePath = type === "user" ? "" : "docs/";
  
  // If no slug, try fetching README.md
  const path = slug.length > 0 ? slug.join("/") : "README";
  
  // Construct URL
  let url = `https://raw.githubusercontent.com/${siteConfig.github.owner}/${repo}/main/${basePath}${path}.md`;
  
  // Special case for user docs root if path is just README
  if (type === "user" && path === "README") {
     url = `https://raw.githubusercontent.com/${siteConfig.github.owner}/${repo}/main/README.md`;
  }

  try {
    let res = await fetch(url, { next: { revalidate: 3600 } });
    
    if (!res.ok && slug.length === 0 && type === "dev") {
      // Fallback to root README for the main docs page (dev only)
      url = `https://raw.githubusercontent.com/${siteConfig.github.owner}/${repo}/main/README.md`;
      res = await fetch(url, { next: { revalidate: 3600 } });
    }

    if (!res.ok) {
        // Try without .md extension if it failed
        url = `https://raw.githubusercontent.com/${siteConfig.github.owner}/${repo}/main/${basePath}${path}`;
        res = await fetch(url, { next: { revalidate: 3600 } });
    }

    if (!res.ok) return type === "dev" ? "# Developer Documentation\n\nWelcome to the developer documentation.\n\nThis section is under construction. Please check the sidebar for available documentation files.\n\n## Getting Started\n\n- [Contributing Guide](/contribute)\n- [GitHub Repository](https://github.com/gambit-devs/gambit-pairing)\n\n" : null;
    return await res.text();
  } catch (error) {
    console.error("Error fetching doc:", error);
    return null;
  }
}
