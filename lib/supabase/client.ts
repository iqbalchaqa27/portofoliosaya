import { createClient, type SupabaseClient } from "@supabase/supabase-js"

let client: SupabaseClient | null = null

export function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
}

export function createSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return null
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

export function getSupabaseClient() {
  if (!client) {
    client = createSupabaseClient()
  }

  return client
}

export async function signInToSupabase(email: string, password: string) {
  const supabase = createSupabaseClient()

  if (!supabase) {
    return { data: null, error: new Error("Supabase is not configured") }
  }

  return supabase.auth.signInWithPassword({ email, password })
}

export async function signOutFromSupabase() {
  const supabase = createSupabaseClient()

  if (!supabase) {
    return { error: new Error("Supabase is not configured") }
  }

  return supabase.auth.signOut()
}

export async function getSupabaseUserFromToken(accessToken: string) {
  const supabase = createSupabaseClient()

  if (!supabase) {
    return { user: null, error: new Error("Supabase is not configured") }
  }

  return supabase.auth.getUser(accessToken)
}
