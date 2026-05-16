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
    .select("uuid, title, description, public_access")
    .eq("uuid", normalizedUuid)
    .maybeSingle<SharedQuestion>()

  if (!question || !question.public_access) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <ShareQuestionStartCard
        uuid={question.uuid}
        title={question.title}
        description={question.description}
      />
    </div>
  )
}
