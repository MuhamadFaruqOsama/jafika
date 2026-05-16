import { randomUUID } from "crypto"
import { mkdir, writeFile } from "fs/promises"
import { extname, join } from "path"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/server"

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

function toBoolean(value: FormDataEntryValue | null, fallback: boolean) {
  if (typeof value !== "string") return fallback
  return value === "true"
}

function sanitizeBaseName(name: string) {
  return name
    .toLowerCase()
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const title = String(formData.get("title") ?? "").trim()
    const description = String(formData.get("description") ?? "").trim()
    const kpkMode = toBoolean(formData.get("kpkMode"), true)
    const fpbMode = toBoolean(formData.get("fpbMode"), true)
    const publicAccess = toBoolean(formData.get("publicAccess"), true)
    const assistant3d = toBoolean(formData.get("assistant3d"), true)
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

    let thumbnail: string | null = null
    if (thumbnailFile instanceof File && thumbnailFile.size > 0) {
      if (!thumbnailFile.type.startsWith("image/")) {
        return jsonError("Thumbnail harus berupa gambar.")
      }

      const rawExt = extname(thumbnailFile.name).toLowerCase()
      const extension = rawExt || ".jpg"
      const safeBaseName = sanitizeBaseName(thumbnailFile.name) || "thumbnail"
      const uniqueFileName = `${Date.now()}-${safeBaseName}-${randomUUID()}${extension}`

      const uploadDir = join(process.cwd(), "public", "img", "thumbnail")
      const uploadPath = join(uploadDir, uniqueFileName)

      await mkdir(uploadDir, { recursive: true })
      const bytes = await thumbnailFile.arrayBuffer()
      await writeFile(uploadPath, Buffer.from(bytes))

      thumbnail = `/img/thumbnail/${uniqueFileName}`
    }

    const supabase = await createClient()
    const { data: authData, error: authError } = await supabase.auth.getUser()

    if (authError || !authData.user) {
      return jsonError("Sesi login tidak valid. Silakan login ulang.", 401)
    }

    const ownerId = authData.user.id
    const creatorName = String(
      authData.user.user_metadata?.nickname ??
      authData.user.user_metadata?.username ??
      authData.user.email ??
      "Pengguna",
    ).trim()

    const { data: createdQuestion, error: createQuestionError } = await supabase
      .from("question")
      .insert({
        uuid: randomUUID(),
        user_id: ownerId,
        creator_name: creatorName || "Pengguna",
        title,
        kpk_mode: kpkMode,
        fpb_mode: fpbMode,
        description,
        find_number: normalizedFindNumber,
        thumbnail,
        public_access: publicAccess,
        "3d_assistant": assistant3d,
      })
      .select("id, uuid")
      .single()

    if (createQuestionError || !createdQuestion) {
      return jsonError(createQuestionError?.message ?? "Gagal menyimpan soal.", 500)
    }

    return NextResponse.json(
      {
        message: "Soal berhasil dibuat.",
        question: createdQuestion,
      },
      { status: 201 },
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan pada server."
    return jsonError(message, 500)
  }
}
