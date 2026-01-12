import { siteConfig } from "./config";

export interface GithubAsset {
  id: number;
  name: string;
  size: number;
  download_count: number;
  browser_download_url: string;
  created_at: string;
  updated_at: string;
  content_type: string;
}

export interface GithubRelease {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string;
  html_url: string;
  assets: GithubAsset[];
}

export async function getReleases(): Promise<GithubRelease[]> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${siteConfig.github.owner}/${siteConfig.github.repo}/releases`,
      { 
        next: { revalidate: 3600 },
        headers: {
          'User-Agent': 'Gambit-Pairing-Site-Builder'
        }
      } // Cache for 1 hour
    );

    if (!response.ok) {
      console.error("Failed to fetch releases:", response.statusText);
      return [];
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching releases:", error);
    return [];
  }
}

export async function getLatestRelease(): Promise<GithubRelease | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${siteConfig.github.owner}/${siteConfig.github.repo}/releases/latest`,
      { 
        next: { revalidate: 3600 },
        headers: {
          'User-Agent': 'Gambit-Pairing-Site-Builder'
        }
      }
    );

    if (!response.ok) {
      // Fallback to getting all releases and picking the first one if latest endpoint fails (e.g. if only pre-releases exist)
      const releases = await getReleases();
      return releases.length > 0 ? releases[0] : null;
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching latest release:", error);
    return null;
  }
}

export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
