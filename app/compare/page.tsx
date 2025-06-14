import { redirect } from "next/navigation"
import { getMatches } from "@/lib/api"
import ComparePage from "@/components/compare-page"

export default async function Compare({
  searchParams,
}: {
  searchParams: { streamer?: string; ghost?: string; match?: string }
}) {
  const streamer = searchParams.streamer?.trim()
  const ghost = searchParams.ghost?.trim()
  const match = searchParams.match

  if (!streamer || !ghost) {
    redirect("/")
  }

  try {
    const streamerMatches = await getMatches(streamer)
    const ghostMatches = await getMatches(ghost)

    // Find common matches
    const streamerMatchSet = new Set(streamerMatches)
    const common = ghostMatches.filter((match) => streamerMatchSet.has(match)).sort()

    return <ComparePage streamer={streamer} ghost={ghost} common={common} initialMatch={match} />
  } catch (error) {
    redirect("/?error=fetchError")
  }
}
