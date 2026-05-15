import { createBrowserClient } from "@supabase/ssr"
import { getSupabaseEnv } from "./env"

let browserClient: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (browserClient) {
    return browserClient
  }

  const { url, publishableKey } = getSupabaseEnv()
  browserClient = createBrowserClient(url, publishableKey)
  return browserClient
}
