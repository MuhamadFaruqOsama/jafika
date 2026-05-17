import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

type RouteContext = {
  params: Promise<{
    uuid: string
  }>
}

type RequestBody = {
  name?: string
}

type FinishBody = {
  action?: "start" | "finish"
  participantId?: number
  numbers?: number[]
  kpkMode?: boolean
  fpbMode?: boolean
}

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

function normalizeFindNumber(value: unknown) {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => Number(item))
    .filter((item) => Number.isFinite(item) && item > 0)
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { uuid } = await context.params
    const normalizedUuid = uuid?.trim() ?? ""

    if (!normalizedUuid) {
      return jsonError("UUID soal tidak valid.")
    }

    const body = (await request.json()) as RequestBody
    const name = body.name?.replace(/\s+/g, " ").trim() ?? ""
    if (name.length < 2) {
      return jsonError("Nama peserta minimal 2 karakter.")
    }

    const supabase = createAdminClient()
    const { data: question, error: questionError } = await supabase
      .from("question")
      .select("id, public_access, find_number, kpk_mode, fpb_mode")
      .eq("uuid", normalizedUuid)
      .maybeSingle()

    if (questionError) {
      return jsonError(questionError.message, 500)
    }

    if (!question || !question.public_access) {
      return jsonError("Soal tidak ditemukan atau tidak bisa diakses publik.", 404)
    }

    const { data: existingParticipant, error: existingParticipantError } = await supabase
      .from("question_participant")
      .select("id")
      .eq("question_id", question.id)
      .ilike("name", name)
      .maybeSingle()

    if (existingParticipantError) {
      return jsonError(existingParticipantError.message, 500)
    }

    if (existingParticipant) {
      return jsonError("Nama sudah digunakan. Pakai nama lain ya.", 409)
    }

    const { data: participant, error: insertError } = await supabase
      .from("question_participant")
      .insert({
        question_id: question.id,
        name,
        start: null,
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

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { uuid } = await context.params
    const normalizedUuid = uuid?.trim() ?? ""

    if (!normalizedUuid) {
      return jsonError("UUID soal tidak valid.")
    }

    const body = (await request.json()) as FinishBody
    const participantId = Number(body.participantId)
    const action = body.action ?? "finish"
    if (!Number.isInteger(participantId) || participantId <= 0) {
      return jsonError("ID peserta tidak valid.")
    }

    const supabase = createAdminClient()
    const { data: question, error: questionError } = await supabase
      .from("question")
      .select("id, public_access, find_number, kpk_mode, fpb_mode")
      .eq("uuid", normalizedUuid)
      .maybeSingle()

    if (questionError) {
      return jsonError(questionError.message, 500)
    }

    if (!question || !question.public_access) {
      return jsonError("Soal tidak ditemukan atau tidak bisa diakses publik.", 404)
    }

    const { data: participant, error: participantError } = await supabase
      .from("question_participant")
      .select("id, start, finish")
      .eq("id", participantId)
      .eq("question_id", question.id)
      .maybeSingle()

    if (participantError) {
      return jsonError(participantError.message, 500)
    }

    if (!participant) {
      return jsonError("Peserta tidak ditemukan.", 404)
    }

    if (action === "start") {
      if (!question.kpk_mode && !question.fpb_mode) {
        return jsonError("Konfigurasi mode soal belum valid.", 400)
      }

      const submittedKpkMode = body.kpkMode === true
      const submittedFpbMode = body.fpbMode === true

      if (!submittedKpkMode && !submittedFpbMode) {
        return jsonError("Pilih minimal satu mode (KPK atau FPB).", 400)
      }

      const isModeMatched =
        submittedKpkMode === question.kpk_mode &&
        submittedFpbMode === question.fpb_mode

      if (!isModeMatched) {
        return jsonError("Mode yang dipilih belum sesuai dengan soal.", 400)
      }

      const expectedNumbers = normalizeFindNumber(question.find_number)
      if (expectedNumbers.length < 2) {
        return jsonError("Data angka soal belum valid.", 400)
      }

      const submittedNumbers = Array.isArray(body.numbers)
        ? body.numbers
          .map((item) => Number(item))
          .filter((item) => Number.isFinite(item) && item > 0)
        : []

      const expectedSorted = [...expectedNumbers].sort((a, b) => a - b)
      const submittedSorted = [...submittedNumbers].sort((a, b) => a - b)
      const isSameLength = expectedSorted.length === submittedSorted.length
      const isMatched =
        isSameLength &&
        expectedSorted.every((item, index) => item === submittedSorted[index])

      if (!isMatched) {
        return jsonError("Angka yang dimasukkan belum sesuai dengan soal.", 400)
      }

      if (participant.start) {
        return NextResponse.json({ message: "Sesi sudah dimulai sebelumnya." })
      }

      const { error: startUpdateError } = await supabase
        .from("question_participant")
        .update({
          start: new Date().toISOString(),
        })
        .eq("id", participantId)
        .eq("question_id", question.id)

      if (startUpdateError) {
        return jsonError(startUpdateError.message, 500)
      }

      return NextResponse.json({
        message: "Sesi berhasil dimulai.",
      })
    }

    if (participant.finish) {
      return NextResponse.json({ message: "Peserta sudah selesai sebelumnya." })
    }

    const { error: updateError } = await supabase
      .from("question_participant")
      .update({
        finish: new Date().toISOString(),
      })
      .eq("id", participantId)
      .eq("question_id", question.id)

    if (updateError) {
      return jsonError(updateError.message, 500)
    }

    return NextResponse.json({
      message: "Peserta berhasil ditandai selesai.",
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan pada server."
    return jsonError(message, 500)
  }
}
