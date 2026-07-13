import type { SiteContent } from "@/lib/site-content"
import { createSupabaseAdminClient, createSupabaseClient } from "@/lib/supabase/client"

const TABLE_NAME = "site_content"
const DEFAULT_ID = "portfolio"

export async function readRemoteSiteContent(): Promise<SiteContent | null> {
  const supabase = createSupabaseAdminClient() ?? createSupabaseClient()

  if (!supabase) {
    return null
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("content")
    .eq("id", DEFAULT_ID)
    .maybeSingle()

  if (error) {
    if ((error as { code?: string }).code === "42P01") {
      return null
    }

    return null
  }

  if (!data?.content) {
    return null
  }

  return data.content as SiteContent
}

export async function writeRemoteSiteContent(content: SiteContent): Promise<boolean> {
  const supabase = createSupabaseAdminClient()

  if (!supabase) {
    return false
  }

  const { error } = await supabase.from(TABLE_NAME).upsert(
    {
      id: DEFAULT_ID,
      content,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  )

  if (error) {
    return false
  }

  return true
}
