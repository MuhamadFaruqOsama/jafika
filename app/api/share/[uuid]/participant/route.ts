import { NextResponse } from "next/server"
import { createClient } from "@/lib/server"

type RouteContext = {
  params: Promise<{
    uuid: string
  }>
}

type RequestBody = {
  name?: string
}

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { uuid } = await context.params
    const normalizedUuid = uuid?.trim() ?? ""

    if (!normalizedUuid) {
      return jsonError("UUID soal tidak valid.")
    }

    const body = (await request.json()) as RequestBody
    const name = body.name?.trim() ?? ""
    if (name.length < 2) {
      return jsonError("Nama peserta minimal 2 karakter.")
    }

    const supabase = await createClient()
    const { data: question, error: questionError } = await supabase
      .from("question")
      .select("id, public_access")
      .eq("uuid", normalizedUuid)
      .maybeSingle()

    if (questionError) {
      return jsonError(questionError.message, 500)
    }

    if (!question || !question.public_access) {
      return jsonError("Soal tidak ditemukan atau tidak bisa diakses publik.", 404)
    }

    const { data: participant, error: insertError } = await supabase
      .from("question_participant")
      .insert({
        question_id: question.id,
        name,
        start: new Date().toISOString(),
        finish: null,
      })
      .select("id")
      .single()

    if (insertError || !participant) {
      return jsonError(insertError?.message ?? "Gagal mencatat peserta.", 500)
    }

    return NextResponse.json({
      message: "Peserta berhasil dicatat.",
      participantId: participant.id,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan pada server."
    return jsonError(message, 500)
  }
}
