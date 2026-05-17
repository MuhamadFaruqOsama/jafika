import { notFound } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/admin"
import { ShareQuestionStartCard } from "@/app/features/share/components/ShareQuestionStartCard"

type SharePageProps = {
  params: Promise<{
    uuid: string
  }>
}

type SharedQuestion = {
  uuid: string
  title: string
  description: string
  creator_name: string | null
  material: string | null
  thumbnail: string | null
  find_number: unknown
  public_access: boolean
  kpk_mode: boolean
  fpb_mode: boolean
  "3d_assistant": boolean
}

function normalizeFindNumber(value: unknown) {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => Number(item))
    .filter((item) => Number.isFinite(item) && item > 0)
}

export default async function SharePage({ params }: SharePageProps) {
  const { uuid } = await params
  const normalizedUuid = uuid?.trim() ?? ""

  if (!normalizedUuid) {
    notFound()
  }

  const supabase = createAdminClient()
  const { data: question } = await supabase
    .from("question")
    .select('uuid, title, description, creator_name, material, thumbnail, find_number, public_access, kpk_mode, fpb_mode, "3d_assistant"')
    .eq("uuid", normalizedUuid)
    .maybeSingle<SharedQuestion>()

  if (!question || !question.public_access) {
    notFound()
  }

  const normalizedCorrectNumbers = normalizeFindNumber(question.find_number)
  if (normalizedCorrectNumbers.length < 2 || (!question.kpk_mode && !question.fpb_mode)) {
    notFound()
  }

  const creatorName = question.creator_name?.trim() || "Pengguna"

  return (
    <div className="min-h-screen bg-gray-50">
      <ShareQuestionStartCard
        uuid={question.uuid}
        title={question.title}
        description={question.description}
        creatorName={creatorName}
        material={question.material}
        thumbnail={question.thumbnail}
        kpk_mode={question.kpk_mode}
        fpb_mode={question.fpb_mode}
        assistant3d={question["3d_assistant"]}
      />
    </div>
  )
}
