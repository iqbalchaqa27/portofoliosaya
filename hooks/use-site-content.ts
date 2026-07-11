"use client"

import { useCallback, useEffect, useState } from "react"

import {
  cloneSiteContent,
  DEFAULT_SITE_CONTENT,
  mergeSiteContent,
  SITE_CONTENT_EVENT,
  SITE_CONTENT_STORAGE_KEY,
  type SiteContent,
} from "@/lib/site-content"

interface AdminCredentials {
  username: string
  password: string
}

interface SaveResult {
  content: SiteContent
  savedRemotely: boolean
}

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>(() => cloneSiteContent())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const localContent = readLocalContent()
    if (localContent) {
      setContent(localContent)
      applySiteContent(localContent)
    } else {
      applySiteContent(DEFAULT_SITE_CONTENT)
    }

    fetch("/api/site-content", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((remoteContent) => {
        if (!isMounted || !remoteContent) return

        const nextContent = pickNewest(localContent, mergeSiteContent(remoteContent))
        setContent(nextContent)
        applySiteContent(nextContent)
        persistLocalContent(nextContent)
      })
      .catch(() => {
        if (!isMounted) return
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    const handleContentChange = () => {
      const nextContent = readLocalContent()
      if (!nextContent) return

      setContent(nextContent)
      applySiteContent(nextContent)
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === SITE_CONTENT_STORAGE_KEY) {
        handleContentChange()
      }
    }

    window.addEventListener("storage", handleStorage)
    window.addEventListener(SITE_CONTENT_EVENT, handleContentChange)

    return () => {
      isMounted = false
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener(SITE_CONTENT_EVENT, handleContentChange)
    }
  }, [])

  const saveContent = useCallback(async (nextContent: SiteContent, credentials: AdminCredentials): Promise<SaveResult> => {
    const stampedContent = mergeSiteContent({
      ...nextContent,
      updatedAt: new Date().toISOString(),
    })

    setContent(stampedContent)
    applySiteContent(stampedContent)
    persistLocalContent(stampedContent)
    notifyContentChange()

    try {
      const response = await fetch("/api/site-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
          content: stampedContent,
        }),
      })

      if (!response.ok) {
        return { content: stampedContent, savedRemotely: false }
      }

      const savedContent = mergeSiteContent(await response.json())
      setContent(savedContent)
      applySiteContent(savedContent)
      persistLocalContent(savedContent)
      notifyContentChange()

      return { content: savedContent, savedRemotely: true }
    } catch {
      return { content: stampedContent, savedRemotely: false }
    }
  }, [])

  const resetContent = useCallback(
    (credentials: AdminCredentials) => saveContent(cloneSiteContent(DEFAULT_SITE_CONTENT), credentials),
    [saveContent],
  )

  return {
    content,
    isLoading,
    saveContent,
    resetContent,
  }
}

export function applySiteContent(content: SiteContent) {
  if (typeof document === "undefined") return

  document.title = content.meta.title

  let description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
  if (!description) {
    description = document.createElement("meta")
    description.name = "description"
    document.head.appendChild(description)
  }
  description.content = content.meta.description

  for (const [key, value] of Object.entries(content.theme)) {
    const rgb = hexToRgb(value)
    if (rgb) {
      document.documentElement.style.setProperty(`--kv-${key}`, rgb)
    }
  }
}

function readLocalContent(): SiteContent | null {
  if (typeof window === "undefined") return null

  try {
    const raw = window.localStorage.getItem(SITE_CONTENT_STORAGE_KEY)
    return raw ? mergeSiteContent(JSON.parse(raw)) : null
  } catch {
    return null
  }
}

function persistLocalContent(content: SiteContent) {
  if (typeof window === "undefined") return

  window.localStorage.setItem(SITE_CONTENT_STORAGE_KEY, JSON.stringify(content))
}

function notifyContentChange() {
  if (typeof window === "undefined") return

  window.dispatchEvent(new Event(SITE_CONTENT_EVENT))
}

function pickNewest(localContent: SiteContent | null, remoteContent: SiteContent): SiteContent {
  if (!localContent) return remoteContent

  return getTime(localContent.updatedAt) > getTime(remoteContent.updatedAt) ? localContent : remoteContent
}

function getTime(value: string) {
  const time = new Date(value).getTime()
  return Number.isNaN(time) ? 0 : time
}

function hexToRgb(hex: string) {
  const normalized = hex.trim().replace(/^#/, "")
  const expanded =
    normalized.length === 3
      ? normalized
          .split("")
          .map((character) => character + character)
          .join("")
      : normalized

  if (!/^[0-9a-fA-F]{6}$/.test(expanded)) {
    return null
  }

  const value = Number.parseInt(expanded, 16)
  const red = (value >> 16) & 255
  const green = (value >> 8) & 255
  const blue = value & 255

  return `${red} ${green} ${blue}`
}
