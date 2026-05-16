import { AdminTable } from "@/app/components/ui/Admin/AdminTable";
import { ParticipantRealtimeRefresher } from "@/app/components/ui/Admin/ParticipantRealtimeRefresher";
import { QRGenerator } from "@/app/components/ui/Admin/QRGenerator";
import { CheckmarkCircle03Icon, Globe02Icon, GlobeXIcon, UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAppBaseUrl } from "@/lib/app-url";
import { createClient } from "@/lib/server";
import { MaterialDownload } from "@/app/components/ui/MaterialDownload";

type DetailPageProps = {
  searchParams: Promise<{
    uuid?: string
  }>
}

type QuestionDetail = {
  id: number
  uuid: string
  title: string
  description: string
  thumbnail: string | null
  created_at: string
  public_access: boolean
  kpk_mode: boolean
  fpb_mode: boolean
  find_number: unknown
}

type ParticipantRow = {
  id: number
  name: string
  start: string | null
  finish: string | null
}

function formatCreatedAtLabel(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return "-"
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(date)
}

function normalizeFindNumber(value: unknown) {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => Number(item))
    .filter((item) => Number.isFinite(item) && item > 0)
}

export default async function RootLayout({ searchParams }: DetailPageProps) {
    const params = await searchParams
    const uuid = params.uuid?.trim() ?? ""
    if (!uuid) {
      notFound()
    }

    const supabase = await createClient()
    const { data: authData } = await supabase.auth.getUser()
    const authUserId = authData.user?.id

    if (!authUserId) {
      notFound()
    }

    const { data: question } = await supabase
      .from("question")
      .select("id, uuid, title, description, thumbnail, created_at, public_access, kpk_mode, fpb_mode, find_number")
      .eq("uuid", uuid)
      .eq("user_id", authUserId)
      .maybeSingle<QuestionDetail>()

    if (!question) {
      notFound()
    }

    const { data: participants } = await supabase
      .from("question_participant")
      .select("id, name, start, finish")
      .eq("question_id", question.id)
      .order("id", { ascending: false })

    const participantRows: ParticipantRow[] = participants ?? []
    const totalParticipant = participantRows.length
    const totalFinished = participantRows.filter((item) => Boolean(item.finish)).length
    const totalNotFinished = totalParticipant - totalFinished

    const baseUrl = getAppBaseUrl()
    const shareLink = `${baseUrl}/share/${question.uuid}`
    const createdAtLabel = formatCreatedAtLabel(question.created_at)
    const findNumbers = normalizeFindNumber(question.find_number)

    return (
        <div className="mt-5 pb-20">
            <ParticipantRealtimeRefresher questionId={question.id} />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                <div className="col-span-1 bg-white p-3 border border-gray-200 rounded-md lg:col-span-3">
                    <div className="bg-pink-400 text-white rounded-full py-1 px-5 w-fit font-medium text-sm mb-5">Detail Soal</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* thumbnail */}
                      <div className="space-y-3">
                        <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                          {question.thumbnail ? (
                            <Image
                              src={question.thumbnail}
                              alt={question.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 1024px) 100vw, 70vw"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-sm text-gray-500">
                              Belum ada thumbnail
                            </div>
                          )}
                        </div>
                        <MaterialDownload/>
                      </div>

                      {/* title */}
                      <div className="">
                        <h1 className="text-xl font-medium">{question.title}</h1>
                        <p className="mt-2 text-gray-700 text-base">{question.description}</p>
                        {/* detail */}
                        <div className="space-y-3 mt-4">
                          <div className="-space-y-0.5">
                            <div className="text-sm text-gray-500">dibuat pada</div>
                            <div className="text-base font-medium">{createdAtLabel}</div>
                          </div>
                          <div className="space-y-0">
                            <div className="text-sm text-gray-500">aksesibilitas</div>
                            <div className="text-base font-medium">
                              <div className={'px-3 py-0.5 text-sm w-fit flex items-center gap-1 rounded-full ' + (question.public_access ? 'bg-blue-400 text-white' : 'bg-gray-200 text-gray-700')}>
                                {
                                  question.public_access ? 
                                  <HugeiconsIcon icon={Globe02Icon} size={15}/> :
                                  <HugeiconsIcon icon={GlobeXIcon} size={15}/>
                                }
                                {
                                  question.public_access ? 
                                  "publik" :
                                  "private"
                                }
                              </div>
                            </div>
                          </div>
                          <div className="space-y-0">
                            <div className="text-sm text-gray-500">tipe soal</div>
                            <div className="text-base font-medium">
                              <div className="flex justify-start gap-1 text-sm font-semibold">
                              {
                                question.kpk_mode && (
                                  <div className="px-2 py-0.5 rounded-md bg-pink-400 text-white flex items-center gap-1">
                                    <HugeiconsIcon icon={CheckmarkCircle03Icon} size={15}/>
                                    KPK
                                  </div>
                                )
                              }
                              {
                                question.fpb_mode && (
                                  <div className="px-2 py-0.5 rounded-md bg-orange-400 text-white flex items-center gap-1">
                                    <HugeiconsIcon icon={CheckmarkCircle03Icon} size={15}/>
                                    FPB
                                  </div>
                                )
                              }
                            </div>
                            </div>
                          </div>
                          <div className="space-y-0">
                            <div className="text-sm text-gray-500">angka yang dicari</div>
                            <div className="text-base font-medium">
                              {findNumbers.length === 0 ? (
                                <span>-</span>
                              ) : (
                                <div className="flex flex-wrap gap-1">
                                  {findNumbers.map((value, index) => (
                                    <span
                                      key={`${value}-${index}`}
                                      className="rounded-md bg-pink-100 px-2 py-0.5 text-sm text-pink-700"
                                    >
                                      {value}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
                <div className="col-span-1 bg-white p-3 border border-gray-200 rounded-md">
                    <QRGenerator
                        link={shareLink}
                    />
                </div>
            </div>
            <div className="bg-white border border-gray-200 p-3 rounded-md mt-3">
                <div className="bg-pink-400 text-white rounded-full py-1 px-5 w-fit font-medium text-sm mb-5">Riwayat Pengerjaan Soal</div>

                <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-3">

                    {/* total yang mngerjakan */}
                    <div className="w-full border border-gray-200 p-3 rounded-md flex justify-between">
                        <div className="w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center">
                            <HugeiconsIcon icon={UserIcon} size={25}/>
                        </div>

                        <div className="flex justify-end items-end flex-col">
                            <div className="text-2xl font-medium">{totalParticipant}</div>
                            <div className="text-sm text-gray-500 line-clamp-1">Total yang mengerjakan</div>
                        </div>
                    </div>

                    {/* total yang sudah selesai */}
                    <div className="w-full border border-gray-200 p-3 rounded-md flex justify-between">
                        <div className="w-10 h-10 rounded-full bg-green-400 text-white flex items-center justify-center">
                            <HugeiconsIcon icon={UserIcon} size={25}/>
                        </div>

                        <div className="flex justify-end items-end flex-col">
                            <div className="text-2xl font-medium">{totalFinished}</div>
                            <div className="text-sm text-gray-500 line-clamp-1">Total yang sudah selesai</div>
                        </div>
                    </div>

                    {/* total yang belum selesai */}
                    <div className="w-full border border-gray-200 p-3 rounded-md flex justify-between">
                        <div className="w-10 h-10 rounded-full bg-orange-400 text-white flex items-center justify-center">
                            <HugeiconsIcon icon={UserIcon} size={25}/>
                        </div>

                        <div className="flex justify-end items-end flex-col">
                            <div className="text-2xl font-medium">{totalNotFinished}</div>
                            <div className="text-sm text-gray-500 line-clamp-1">Total yang belum selesai</div>
                        </div>
                    </div>

                </div>
                
                <AdminTable
                  rows={participantRows.map((item) => ({
                    id: item.id,
                    name: item.name,
                    start: item.start,
                    finish: item.finish,
                    questionTitle: question.title,
                  }))}
                />
            </div>
        </div>
    )
}
