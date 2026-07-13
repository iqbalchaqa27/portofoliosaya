import { mkdir, writeFile } from "fs/promises"
import path from "path"
import { NextResponse } from "next/server"

import { ADMIN_PASSWORD, ADMIN_USERNAME } from "@/lib/site-content"
import { createSupabaseAdminClient } from "@/lib/supabase/client"

export const runtime = "nodejs"

const allowedTypes = new Map([
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/webp", "webp"],
  ["application/pdf", "pdf"],
  ["application/msword", "doc"],
  ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "docx"],
])

const maxUploadSize = 10 * 1024 * 1024

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const username = String(formData.get("username") ?? "")
    const password = String(formData.get("password") ?? "")
    const file = formData.get("file")
    const authHeader = request.headers.get("authorization")

    const isSupabaseAuthenticated = authHeader?.startsWith("Bearer ")
      ? await (async () => {
          const { createSupabaseClient } = await import("@/lib/supabase/client")
          const supabase = createSupabaseClient()
          const token = authHeader.slice(7)
          const response = supabase?.auth.getUser(token) ?? { data: { user: null }, error: new Error("Missing client") }
          const result = await response
          return !result.error && !!result.data.user
        })()
      : false

    if (!isSupabaseAuthenticated && (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 })
    }

    const extension = allowedTypes.get(file.type)
    if (!extension) {
      return NextResponse.json({ error: "Format harus PNG, JPG, WEBP, PDF, DOC, atau DOCX" }, { status: 400 })
    }

    if (file.size > maxUploadSize) {
      return NextResponse.json({ error: "Ukuran file maksimal 10MB" }, { status: 400 })
    }

    const bytes = Buffer.from(await file.arrayBuffer())
    const safeBaseName = path
      .basename(file.name, path.extname(file.name))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48)
    const fileName = `${safeBaseName || "file"}-${Date.now()}.${extension}`

    const supabase = createSupabaseAdminClient()
    if (supabase) {
      const { error: uploadError } = await supabase.storage.from("portfolio-images").upload(fileName, bytes, {
        contentType: file.type,
        upsert: true,
      })

      if (!uploadError) {
        const { data } = supabase.storage.from("portfolio-images").getPublicUrl(fileName)
        return NextResponse.json({
          url: data.publicUrl,
          fileName,
          size: file.size,
          type: file.type,
        })
      }
    }

    const uploadsDirectory = path.join(process.cwd(), "public", "uploads")
    const destination = path.join(uploadsDirectory, fileName)

    await mkdir(uploadsDirectory, { recursive: true })
    await writeFile(destination, bytes)

    return NextResponse.json({
      url: `/uploads/${fileName}`,
      fileName,
      size: file.size,
      type: file.type,
    })
  } catch {
    return NextResponse.json({ error: "Upload gagal" }, { status: 500 })
  }
}
