"use client"

import type React from "react"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Create a client component that uses the search params
function IndexPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const [streamer, setStreamer] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    router.push(`/ghosts?streamer=${encodeURIComponent(streamer.trim())}`)
  }

  return (
    <div className="w-full max-w-md text-center">
      <h1 className="mb-4 text-2xl font-bold">SON 100 MAÇ GEÇMİŞİNİ ALIR KIYASLAMAK İÇİN HEM SENİN HEMDE ARADIĞIN KİŞİNİN GEÇMİŞİ İLE KARŞILAŞTIRIR.TÜM MAÇLARA ŞUANDA ERİŞEBİLEN BİR WEB SİTE API'Sİ VAR İSE BİLGİLENDİRME İÇİN DISCORD @unfortunatelyplayer</h1>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error === "userNotFound" ? "Kullanıcı bulunamadı." : "Bir hata oluştu."}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Input
          value={streamer}
          onChange={(e) => setStreamer(e.target.value)}
          className="mb-3 bg-gray-800 text-white placeholder:text-gray-400"
          placeholder="PUBG Kullanıcı Adınız"
          required
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Yükleniyor..." : "Devam Et"}
        </Button>
      </form>
    </div>
  )
}

// Main component with Suspense boundary
export default function IndexPage() {
  return (
    <div className="container py-5 position-relative">
      <div className="flex justify-center">
        <Suspense fallback={<div>Loading...</div>}>
          <IndexPageContent />
        </Suspense>
      </div>
    </div>
  )
}
