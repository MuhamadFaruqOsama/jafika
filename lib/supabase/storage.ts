import { randomUUID } from "crypto"
import { extname } from "path"
import { createAdminClient } from "./admin"

const MATERIAL_BUCKET = "question-materials"
const THUMBNAIL_BUCKET = "question-thumbnails"

function sanitizeBaseName(name: string) {
  return name
    .toLowerCase()
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

async function ensurePublicBucket(bucket: string) {
  const admin = createAdminClient()
  const { error } = await admin.storage.createBucket(bucket, {
    public: true,
  })

  if (!error) return admin

  const maybeCode = (error as { code?: string }).code
  const isAlreadyExists =
    maybeCode === "BucketAlreadyExists" ||
    maybeCode === "already_exists" ||
    /already exists/i.test(error.message)

  if (!isAlreadyExists) {
    throw new Error(error.message)
  }

  return admin
}

async function uploadPublicFile(options: {
  bucket: string
  file: File
  fallbackBaseName: string
  extension: string
  contentType: string
  folder: string
}) {
  const { bucket, file, fallbackBaseName, extension, contentType, folder } = options
  const safeBaseName = sanitizeBaseName(file.name) || fallbackBaseName
  const uniqueFileName = `${Date.now()}-${safeBaseName}-${randomUUID()}${extension}`
  const objectPath = `${folder}/${uniqueFileName}`
  const fileBytes = new Uint8Array(await file.arrayBuffer())

  const admin = await ensurePublicBucket(bucket)
  const { error: uploadError } = await admin.storage.from(bucket).upload(objectPath, fileBytes, {
    contentType,
    upsert: false,
  })

  if (uploadError) {
    throw new Error(uploadError.message)
  }

  const { data } = admin.storage.from(bucket).getPublicUrl(objectPath)
  return data.publicUrl
}

export async function uploadQuestionMaterial(file: File) {
  return uploadPublicFile({
    bucket: MATERIAL_BUCKET,
    file,
    fallbackBaseName: "material",
    extension: ".pdf",
    contentType: "application/pdf",
    folder: "material",
  })
}

export async function uploadQuestionThumbnail(file: File) {
  const rawExtension = extname(file.name).toLowerCase()
  const extension = rawExtension || ".jpg"
  const contentType = file.type || "image/jpeg"

  return uploadPublicFile({
    bucket: THUMBNAIL_BUCKET,
    file,
    fallbackBaseName: "thumbnail",
    extension,
    contentType,
    folder: "thumbnail",
  })
}
