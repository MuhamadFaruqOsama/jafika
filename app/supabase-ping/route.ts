import { NextResponse } from "next/server"
import { createClient } from "@/lib/server"

export async function GET() {
  const start = Date.now()

  try {
    const supabase = await createClient()

    const { error, count } = await supabase
      .from("users")
      .select("id", { count: "exact", head: true })

    if (!error) {
      return NextResponse.json({
        ok: true,
        message: "Supabase connected.",
        database: {
          table: "users",
          reachable: true,
          count,
        },
        durationMs: Date.now() - start,
      })
    }

    const isConnectedButUnauthorized =
      error.code === "42501" || error.code === "42P01"

    return NextResponse.json(
      {
        ok: isConnectedButUnauthorized,
        message: isConnectedButUnauthorized
          ? "Supabase connected, but table access is not ready for this key."
          : "Failed to query Supabase.",
        database: {
          table: "users",
          reachable: false,
          code: error.code,
          detail: error.message,
        },
        durationMs: Date.now() - start,
      },
      { status: isConnectedButUnauthorized ? 200 : 500 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: "Supabase connection check failed.",
        detail: error instanceof Error ? error.message : "Unknown error",
        durationMs: Date.now() - start,
      },
      { status: 500 },
    )
  }
}
