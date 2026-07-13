import { NextResponse } from "next/server"

import { ADMIN_PASSWORD, ADMIN_USERNAME } from "@/lib/site-content"
import { createSupabaseAdminClient, getSupabaseUserFromToken } from "@/lib/supabase/client"

export const runtime = "nodejs"

const TABLE_NAME = "contact_messages"
const maxFieldLength = 200
const maxMessageLength = 5000

export async function GET(request: Request) {
  const isAdmin = await isAdminRequest(request)
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createSupabaseAdminClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 })
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("id,name,email,subject,message,created_at")
    .order("created_at", { ascending: false })
    .limit(100)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ messages: data ?? [] })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const name = cleanText(body.name, maxFieldLength)
    const email = cleanText(body.email, maxFieldLength)
    const subject = cleanText(body.subject, maxFieldLength)
    const message = cleanText(body.message, maxMessageLength)

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 })
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: "Email tidak valid" }, { status: 400 })
    }

    const supabase = createSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 })
    }

    const { error } = await supabase.from(TABLE_NAME).insert({ name, email, subject, message })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
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

function cleanText(value: unknown, maxLength: number) {
  return String(value ?? "").trim().slice(0, maxLength)
}
