import { notFound } from "next/navigation"
import { createClient } from "@/lib/server"
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
  public_access: boolean
  kpk_mode: boolean
  fpb_mode: boolean
}

export default async function SharePage({ params }: SharePageProps) {
  const { uuid } = await params
  const normalizedUuid = uuid?.trim() ?? ""

  if (!normalizedUuid) {
    notFound()
  }

  const supabase = await createClient()
  const { data: question } = await supabase
    .from("question")
    .select("uuid, title, description, public_access, kpk_mode, fpb_mode")
    .eq("uuid", normalizedUuid)
    .maybeSingle<SharedQuestion>()

  if (!question || !question.public_access) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <ShareQuestionStartCard
        uuid={question.uuid}
        title={question.title}
        description={question.description}
        kpk_mode={question.kpk_mode}
        fpb_mode={question.fpb_mode}
      />
    </div>
  )
}
