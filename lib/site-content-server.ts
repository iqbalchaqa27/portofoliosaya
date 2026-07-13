import { mkdir, readFile, writeFile } from "fs/promises"
import path from "path"

import { cloneSiteContent, mergeSiteContent, type SiteContent } from "@/lib/site-content"
import { readRemoteSiteContent, writeRemoteSiteContent } from "@/lib/site-content-supabase"

const contentFilePath = path.join(process.cwd(), "data", "site-content.json")

export async function readSiteContent(): Promise<SiteContent> {
  const remoteContent = await readRemoteSiteContent()
  if (remoteContent) {
    return mergeSiteContent(remoteContent)
  }

  try {
    const raw = await readFile(contentFilePath, "utf8")
    return mergeSiteContent(JSON.parse(raw))
  } catch {
    return cloneSiteContent()
  }
}

export async function writeSiteContent(content: SiteContent): Promise<SiteContent> {
  const nextContent = mergeSiteContent(content)

  const remoteSaved = await writeRemoteSiteContent(nextContent)
  if (remoteSaved) {
    return nextContent
  }

  await mkdir(path.dirname(contentFilePath), { recursive: true })
  await writeFile(contentFilePath, `${JSON.stringify(nextContent, null, 2)}\n`, "utf8")
  return nextContent
}
