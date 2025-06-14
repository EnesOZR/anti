"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"

interface ComparePageProps {
  streamer: string
  ghost: string
  common: string[]
  initialMatch?: string
}

export default function ComparePage({ streamer, ghost, common, initialMatch }: ComparePageProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("matches")
  const [currentMatch, setCurrentMatch] = useState<string | null>(initialMatch || null)
  const [loading, setLoading] = useState(false)
  const [framesLoaded, setFramesLoaded] = useState({ frame1: false, frame2: false })

  useEffect(() => {
    if (initialMatch) {
      setActiveTab("detail")
      setCurrentMatch(initialMatch)
    }
  }, [initialMatch])

  const handleMatchClick = (match: string) => {
    setLoading(true)
    setFramesLoaded({ frame1: false, frame2: false })
    setCurrentMatch(match)
    setActiveTab("detail")

    // Update URL without full page reload
    const newUrl = `/compare?streamer=${encodeURIComponent(streamer)}&ghost=${encodeURIComponent(ghost)}&match=${encodeURIComponent(match)}`
    window.history.pushState({ match }, "", newUrl)
  }

  const handleFrameLoad = (frame: "frame1" | "frame2") => {
    setFramesLoaded((prev) => ({ ...prev, [frame]: true }))
    if (frame === "frame2" && framesLoaded.frame1) {
      setLoading(false)
    } else if (frame === "frame1" && framesLoaded.frame2) {
      setLoading(false)
    }
  }

  const reloadFrames = () => {
    setFramesLoaded({ frame1: false, frame2: false })
    setLoading(true)
    // Force reload iframes
    const frame1 = document.getElementById("frame1") as HTMLIFrameElement
    const frame2 = document.getElementById("frame2") as HTMLIFrameElement
    if (frame1) frame1.src = frame1.src
    if (frame2) frame2.src = frame2.src
  }

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.match) {
        setCurrentMatch(event.state.match)
        setActiveTab("detail")
      } else {
        setActiveTab("matches")
      }
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  return (
    <div className="container py-5 position-relative">
      <h2 className="mb-4 text-center text-xl font-bold">
        {streamer} & {ghost}
      </h2>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="matches">Ortak Maçlar</TabsTrigger>
          {currentMatch && <TabsTrigger value="detail">Maç Detayı</TabsTrigger>}
        </TabsList>

        <TabsContent value="matches" className="space-y-2">
          {common.length > 0 ? (
            common.map((match) => (
              <div
                key={match}
                onClick={() => handleMatchClick(match)}
                className="p-3 bg-gray-800 hover:bg-gray-700 rounded cursor-pointer match-item"
              >
                https://pubg.sh/{ghost}/steam/{match}
              </div>
            ))
          ) : (
            <div className="p-4 bg-yellow-900/30 text-yellow-200 rounded">14 Gün içinde hiç ortak maç bulunamadı.</div>
          )}
        </TabsContent>

        <TabsContent value="detail" id="detail">
          {loading && (
            <div className="spinner-overlay flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}

          {currentMatch && (
            <>
              <div className="iframe-row">
                <div className="iframe-wrapper">
                  <Card className="mb-2">
                    <CardHeader className="py-2">Streamer: {streamer}</CardHeader>
                  </Card>
                  <iframe
                    id="frame1"
                    src={`https://pubg.sh/${streamer}/steam/${currentMatch}`}
                    onLoad={() => handleFrameLoad("frame1")}
                    allowFullScreen
                  />
                </div>
                <div className="iframe-wrapper">
                  <Card className="mb-2">
                    <CardHeader className="py-2">Ghost: {ghost}</CardHeader>
                  </Card>
                  <iframe
                    id="frame2"
                    src={`https://pubg.sh/${ghost}/steam/${currentMatch}`}
                    onLoad={() => handleFrameLoad("frame2")}
                    allowFullScreen
                  />
                </div>
              </div>

              <div id="info-box" className="flex">
                <Link href={`/ghosts?streamer=${encodeURIComponent(streamer)}`} className="btn btn-sm btn-secondary">
                  👥 Ghostlara Dön
                </Link>
                <Link href="/" className="btn btn-sm btn-secondary">
                  🔄 Streamer Değiştir
                </Link>
                <span>📢 Yükleme başarısızsa, butona tıklayınız.</span>
                <Button size="sm" variant="default" onClick={reloadFrames}>
                  Yenile
                </Button>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      <div className="text-center mt-8">
        <Link
          href={`/ghosts?streamer=${encodeURIComponent(streamer)}`}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-gray-700 hover:bg-gray-600 text-white h-10 px-4 py-2"
        >
          📝 Listeye dön
        </Link>
      </div>
    </div>
  )
}
