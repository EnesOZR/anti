import Link from "next/link"
import type { GhostPlayer } from "@/lib/types"

interface GhostsPageProps {
  streamer: string
  ghosts: GhostPlayer[]
}

export default function GhostsPage({ streamer, ghosts }: GhostsPageProps) {
  return (
    <div className="container py-5 position-relative">
      <Link href="/" className="btn btn-primary floating-btn">
        🔄
      </Link>
      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          <h2 className="mb-4 text-center text-xl font-bold">{streamer}</h2>
          <div className="space-y-2">
            {ghosts.map((ghost) => (
              <Link
                key={ghost.name}
                href={`/compare?streamer=${encodeURIComponent(streamer)}&ghost=${encodeURIComponent(ghost.name)}`}
                className="block p-3 bg-gray-800 hover:bg-gray-700 text-white rounded transition-all"
              >
                {ghost.name} ({ghost.total})
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
