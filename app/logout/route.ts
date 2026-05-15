import { createServerClient } from "@supabase/ssr"
import { NextRequest, NextResponse } from "next/server"
import { getSupabaseEnv } from "@/lib/supabase/env"

export async function GET(request: NextRequest) {
  const { url, publishableKey } = getSupabaseEnv()
  const response = NextResponse.redirect(new URL("/login", request.url))

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        )
      },
    },
  })

  await supabase.auth.signOut()
  return response
}

