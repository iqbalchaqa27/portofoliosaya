import { NextResponse } from "next/server"

import { ADMIN_PASSWORD, ADMIN_USERNAME, mergeSiteContent } from "@/lib/site-content"
import { readSiteContent, writeSiteContent } from "@/lib/site-content-server"

export async function GET() {
  const content = await readSiteContent()
  return NextResponse.json(content)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (body.username !== ADMIN_USERNAME || body.password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const content = mergeSiteContent({
      ...body.content,
      updatedAt: new Date().toISOString(),
    })

    const savedContent = await writeSiteContent(content)
    return NextResponse.json(savedContent)
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
