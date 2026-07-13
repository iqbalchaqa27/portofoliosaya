"use client"

import { useCallback, useEffect, useRef, useState } from "react"

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
  accessToken?: string
}

interface SaveResult {
  content: SiteContent
  savedRemotely: boolean
}

export function useSiteContent(initialContent?: SiteContent) {
  const initialContentRef = useRef<SiteContent | null>(initialContent ? mergeSiteContent(initialContent) : null)
  const [content, setContent] = useState<SiteContent>(() => initialContentRef.current ?? cloneSiteContent())
  const [isLoading, setIsLoading] = useState(!initialContentRef.current)

  useEffect(() => {
    let isMounted = true
    const hydratedContent = initialContentRef.current

    clearLocalContentCache()
    if (hydratedContent) {
      applySiteContent(hydratedContent)
    }

    fetch(`/api/site-content?ts=${Date.now()}`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((remoteContent) => {
        if (!isMounted) return

        if (!remoteContent) {
          if (!hydratedContent) {
            applySiteContent(DEFAULT_SITE_CONTENT)
          }
          return
        }

        const nextContent = mergeSiteContent(remoteContent)
        setContent(nextContent)
        applySiteContent(nextContent)
        clearLocalContentCache()
      })
      .catch(() => {
        if (!isMounted) return
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    const handleContentChange = () => {
      clearLocalContentCache()
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === SITE_CONTENT_STORAGE_KEY) {
        clearLocalContentCache()
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
    clearLocalContentCache()
    notifyContentChange()

    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      }
      if (credentials.accessToken) {
        headers.Authorization = `Bearer ${credentials.accessToken}`
      }

      const response = await fetch(`/api/site-content?ts=${Date.now()}`, {
        method: "POST",
        headers,
        cache: "no-store",
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
      clearLocalContentCache()
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

function clearLocalContentCache() {
  if (typeof window === "undefined") return

  try {
    window.localStorage.removeItem(SITE_CONTENT_STORAGE_KEY)
  } catch {
    // Ignore storage access errors.
  }
}

function notifyContentChange() {
  if (typeof window === "undefined") return

  window.dispatchEvent(new Event(SITE_CONTENT_EVENT))
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