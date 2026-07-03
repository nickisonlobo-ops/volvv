import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Client Supabase de SERVIDOR, com a service role key.
 */
let client: SupabaseClient | null = null

export function useSupabaseServer(): SupabaseClient {
  if (client) return client

  const config = useRuntimeConfig()
  const url = (config.supabaseUrl || process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL) as string
  const key = (config.supabaseServiceKey || process.env.SUPABASE_SERVICE_ROLE_KEY) as string

  if (!url || !key) {
    console.error('[supabase] SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não configurados')
    throw createError({
      statusCode: 500,
      message: 'Supabase não configurado (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).',
    })
  }

  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return client
}
