import { NextResponse } from "next/server"

const API_BASE = "https://chickendinner.gg/api"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get("name")

  if (!name) {
    return NextResponse.json({ error: "Name parameter is required" }, { status: 400 })
  }

  try {
    // In a real implementation, we would need to handle the cloudscraper functionality
    // For now, we'll make a direct fetch request
    const response = await fetch(`${API_BASE}/matches?name=${encodeURIComponent(name)}&region=steam`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json({ matches: data.matches || [] })
  } catch (error) {
    console.error("Error fetching matches:", error)
    return NextResponse.json({ error: "Failed to fetch matches" }, { status: 500 })
  }
}
