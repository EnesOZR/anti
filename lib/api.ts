import type { GhostPlayer } from "./types"

const API_BASE = "https://chickendinner.gg/api"
const UMBRA_URL = "https://www.pubgumbra.com/src/api/names.php"

export async function getGhosts(username: string): Promise<GhostPlayer[]> {
  const headers = {
    "User-Agent": "Mozilla/5.0",
    Origin: "https://www.pubgumbra.com",
    Referer: "https://www.pubgumbra.com/",
    "Content-Type": "application/x-www-form-urlencoded",
  }

  const formData = new URLSearchParams()
  formData.append("username", username)

  const response = await fetch(UMBRA_URL, {
    method: "POST",
    headers,
    body: formData,
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch ghosts: ${response.status}`)
  }

  const data = await response.json()

  if (!Array.isArray(data)) {
    throw new Error("Invalid response format")
  }

  return data
}

export async function getMatches(username: string): Promise<string[]> {
  // We'll use a server-side API route to handle the cloudscraper functionality
  const response = await fetch(`/api/matches?name=${encodeURIComponent(username)}`, {
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch matches: ${response.status}`)
  }

  const data = await response.json()
  return data.matches || []
}
