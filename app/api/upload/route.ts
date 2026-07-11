import { mkdir, writeFile } from "fs/promises"
import path from "path"
import { NextResponse } from "next/server"

import { ADMIN_PASSWORD, ADMIN_USERNAME } from "@/lib/site-content"

export const runtime = "nodejs"

const allowedTypes = new Map([
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/webp", "webp"],
])

const maxUploadSize = 8 * 1024 * 1024

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const username = String(formData.get("username") ?? "")
    const password = String(formData.get("password") ?? "")
    const file = formData.get("file")

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 })
    }

    const extension = allowedTypes.get(file.type)
    if (!extension) {
      return NextResponse.json({ error: "Format harus PNG, JPG, JPEG, atau WEBP" }, { status: 400 })
    }

    if (file.size > maxUploadSize) {
      return NextResponse.json({ error: "Ukuran file maksimal 8MB" }, { status: 400 })
    }

    const uploadsDirectory = path.join(process.cwd(), "public", "uploads")
    const safeBaseName = path
      .basename(file.name, path.extname(file.name))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48)
    const fileName = `${safeBaseName || "image"}-${Date.now()}.${extension}`
    const destination = path.join(uploadsDirectory, fileName)
    const bytes = Buffer.from(await file.arrayBuffer())

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
