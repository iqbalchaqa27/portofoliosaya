import { NextResponse } from "next/server"
import localSiteContent from "@/data/site-content.json"
import { ADMIN_PASSWORD, ADMIN_USERNAME, mergeSiteContent } from "@/lib/site-content"
import { createSupabaseAdminClient, getSupabaseUserFromToken } from "@/lib/supabase/client"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function POST(request: Request) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 })
    }

    const supabase = createSupabaseAdminClient()

    if (!supabase) {
      return NextResponse.json(
        { ok: false, message: "Missing SUPABASE_SERVICE_ROLE_KEY" },
        { status: 500 }
      )
    }

    const content = mergeSiteContent(localSiteContent)
    const { error } = await supabase.from("site_content").upsert(
      {
        id: "portfolio",
        content,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    )

    if (error) {
      return NextResponse.json({ ok: false, message: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

async function isAdminRequest(request: Request) {
  const authHeader = request.headers.get("authorization")

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7)
    const response = await getSupabaseUserFromToken(token)
    return !response.error && !!response.data.user
  }

  const username = request.headers.get("x-admin-username") ?? ""
  const password = request.headers.get("x-admin-password") ?? ""

  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD
}
