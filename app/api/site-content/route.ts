import { NextResponse } from "next/server"

import { ADMIN_PASSWORD, ADMIN_USERNAME, mergeSiteContent } from "@/lib/site-content"
import { readSiteContent, writeSiteContent } from "@/lib/site-content-server"
import { getSupabaseUserFromToken } from "@/lib/supabase/client"

export const dynamic = "force-dynamic"
export const revalidate = 0

const noStoreHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "CDN-Cache-Control": "no-store",
  "Vercel-CDN-Cache-Control": "no-store",
  Pragma: "no-cache",
  Expires: "0",
}

export async function GET() {
  const content = await readSiteContent()
  return NextResponse.json(content, { headers: noStoreHeaders })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const authHeader = request.headers.get("authorization")

    const isSupabaseAuthenticated = authHeader?.startsWith("Bearer ")
      ? await (async () => {
          const token = authHeader.slice(7)
          const response = await getSupabaseUserFromToken(token)
          return !response.error && !!response.data.user
        })()
      : false

    if (!isSupabaseAuthenticated && (body.username !== ADMIN_USERNAME || body.password !== ADMIN_PASSWORD)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noStoreHeaders })
    }

    const content = mergeSiteContent({
      ...body.content,
      updatedAt: new Date().toISOString(),
    })

    const savedContent = await writeSiteContent(content)
    return NextResponse.json(savedContent, { headers: noStoreHeaders })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400, headers: noStoreHeaders })
  }
}
