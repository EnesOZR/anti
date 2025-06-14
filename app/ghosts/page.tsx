import { redirect } from "next/navigation"
import { getGhosts } from "@/lib/api"
import GhostsPage from "@/components/ghosts-page"

export default async function Ghosts({
  searchParams,
}: {
  searchParams: { streamer?: string }
}) {
  const streamer = searchParams.streamer?.trim()

  if (!streamer) {
    redirect("/")
  }

  try {
    const ghosts = await getGhosts(streamer)
    return <GhostsPage streamer={streamer} ghosts={ghosts} />
  } catch (error) {
    redirect("/?error=userNotFound")
  }
}
