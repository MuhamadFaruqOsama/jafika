import { extname } from "path"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/server"
import { uploadQuestionMaterial, uploadQuestionThumbnail } from "@/lib/supabase/storage"

type RouteContext = {
  params: Promise<{
    uuid: string
  }>
}

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

function toBoolean(value: FormDataEntryValue | null, fallback: boolean) {
  if (typeof value !== "string") return fallback
  return value === "true"
}

function isPdfFile(file: File) {
  return file.type === "application/pdf" || extname(file.name).toLowerCase() === ".pdf"
}

export async function DELETE(_: Request, context: RouteContext) {
  try {
    const { uuid } = await context.params
    const normalizedUuid = uuid?.trim() ?? ""

    if (!normalizedUuid) {
      return jsonError("UUID soal tidak valid.")
    }

    const supabase = await createClient()
    const { data: authData, error: authError } = await supabase.auth.getUser()

    if (authError || !authData.user) {
      return jsonError("Sesi login tidak valid. Silakan login ulang.", 401)
    }

    const { data: question, error: findQuestionError } = await supabase
      .from("question")
      .select("id")
      .eq("uuid", normalizedUuid)
      .maybeSingle()

    if (findQuestionError) {
      return jsonError(findQuestionError.message, 500)
    }

    if (!question) {
      return jsonError("Soal tidak ditemukan.", 404)
    }

    const { error: deleteError } = await supabase
      .from("question")
      .delete()
      .eq("id", question.id)

    if (deleteError) {
      return jsonError(deleteError.message, 500)
    }

    return NextResponse.json({ message: "Soal berhasil dihapus." })
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

    const formData = await request.formData()
    const title = String(formData.get("title") ?? "").trim()
    const description = String(formData.get("description") ?? "").trim()
    const kpkMode = toBoolean(formData.get("kpkMode"), true)
    const fpbMode = toBoolean(formData.get("fpbMode"), true)
    const publicAccess = toBoolean(formData.get("publicAccess"), true)
    const assistant3d = toBoolean(formData.get("assistant3d"), true)
    const materialFile = formData.get("material")
    const thumbnailFile = formData.get("thumbnail")

    let parsedFindNumber: unknown = []
    try {
      parsedFindNumber = JSON.parse(String(formData.get("findNumber") ?? "[]"))
    } catch {
      parsedFindNumber = []
    }

    const findNumber = Array.isArray(parsedFindNumber) ? parsedFindNumber : []

    if (!title) {
      return jsonError("Judul soal wajib diisi.")
    }

    if (!description) {
      return jsonError("Deskripsi soal wajib diisi.")
    }

    if (!kpkMode && !fpbMode) {
      return jsonError("Pilih minimal satu mode soal.")
    }

    if (findNumber.length < 2) {
      return jsonError("Minimal isi dua bilangan untuk dicari.")
    }

    const normalizedFindNumber = findNumber
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value))

    if (normalizedFindNumber.length < 2) {
      return jsonError("Bilangan yang dicari tidak valid.")
    }

    const supabase = await createClient()
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError || !authData.user) {
      return jsonError("Sesi login tidak valid. Silakan login ulang.", 401)
    }
    const creatorName = String(
      authData.user.user_metadata?.nickname ??
      authData.user.user_metadata?.username ??
      authData.user.email ??
      "Pengguna",
    ).trim()

    const { data: currentQuestion, error: currentQuestionError } = await supabase
      .from("question")
      .select("id, material, thumbnail")
      .eq("uuid", normalizedUuid)
      .maybeSingle()

    if (currentQuestionError) {
      return jsonError(currentQuestionError.message, 500)
    }

    if (!currentQuestion) {
      return jsonError("Soal tidak ditemukan.", 404)
    }

    let material = currentQuestion.material as string | null
    if (materialFile instanceof File && materialFile.size > 0) {
      if (!isPdfFile(materialFile)) {
        return jsonError("Materi harus berformat PDF.")
      }

      material = await uploadQuestionMaterial(materialFile)
    }

    let thumbnail = currentQuestion.thumbnail as string | null
    if (thumbnailFile instanceof File && thumbnailFile.size > 0) {
      if (!thumbnailFile.type.startsWith("image/")) {
        return jsonError("Thumbnail harus berupa gambar.")
      }

      thumbnail = await uploadQuestionThumbnail(thumbnailFile)
    }

    const { error: updateError } = await supabase
      .from("question")
      .update({
        title,
        description,
        creator_name: creatorName || "Pengguna",
        kpk_mode: kpkMode,
        fpb_mode: fpbMode,
        find_number: normalizedFindNumber,
        material,
        thumbnail,
        public_access: publicAccess,
        "3d_assistant": assistant3d,
        updated_at: new Date().toISOString(),
      })
      .eq("id", currentQuestion.id)

    if (updateError) {
      return jsonError(updateError.message, 500)
    }

    return NextResponse.json({ message: "Soal berhasil diperbarui." })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan pada server."
    return jsonError(message, 500)
  }
}
