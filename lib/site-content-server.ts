import { mkdir, readFile, writeFile } from "fs/promises"
import path from "path"

import { cloneSiteContent, mergeSiteContent, type SiteContent } from "@/lib/site-content"

const contentFilePath = path.join(process.cwd(), "data", "site-content.json")

export async function readSiteContent(): Promise<SiteContent> {
  try {
    const raw = await readFile(contentFilePath, "utf8")
    return mergeSiteContent(JSON.parse(raw))
  } catch {
    return cloneSiteContent()
  }
}

export async function writeSiteContent(content: SiteContent): Promise<SiteContent> {
  const nextContent = mergeSiteContent(content)
  await mkdir(path.dirname(contentFilePath), { recursive: true })
  await writeFile(contentFilePath, `${JSON.stringify(nextContent, null, 2)}\n`, "utf8")
  return nextContent
}
