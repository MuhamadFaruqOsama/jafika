"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { CheckmarkCircle03Icon, Globe02Icon, GlobeXIcon, MoreVerticalSquare01Icon, Share05Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { DialogEditQuestion } from "./DialogEditQuestion"

type QuestionCardItem = {
  id: number
  uuid: string
  title: string
  description: string
  kpk_mode: boolean
  fpb_mode: boolean
  find_number: unknown
  thumbnail: string | null
  public_access: boolean
  "3d_assistant": boolean
  created_at: string
  created_at_label: string
}

type AdminQuestionCardProps = {
  question: QuestionCardItem
}

type DeleteResponse = {
  error?: string
  message?: string
}

function normalizeThumbnailSrc(value: string | null) {
  if (!value) return null
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/")) {
    return value
  }

  return null
}

export function AdminQuestionCard({ question }: AdminQuestionCardProps) {
    const router = useRouter()
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [openEditDialog, setOpenEditDialog] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const thumbnailSrc = useMemo(() => normalizeThumbnailSrc(question.thumbnail), [question.thumbnail])

    const handleDelete = async () => {
      setIsDeleting(true)
      try {
        const response = await fetch(`/api/question/${question.uuid}`, {
          method: "DELETE",
        })

        const payload = (await response.json()) as DeleteResponse
        if (!response.ok) {
          toast.error(payload.error ?? "Gagal menghapus soal.")
          return
        }

        toast.success(payload.message ?? "Soal berhasil dihapus.")
        setOpenDeleteDialog(false)
        router.refresh()
      } catch {
        toast.error("Terjadi kendala jaringan. Coba lagi.")
      } finally {
        setIsDeleting(false)
      }
    }

    return (
        <div className="bg-white border border-gray-200 p-2 rounded-lg hover:shadow-sm">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className={'px-3 py-0.5 text-sm flex items-center gap-1 rounded-full ' + (question.public_access ? 'bg-blue-400 text-white' : 'bg-gray-200 text-gray-700')}>
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
                  <div className="text-sm text-gray-600">{question.created_at_label}</div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            className="p-2 flex items-center justify-center rounded-md hover:bg-gray-100 cursor-pointer bg-white transition-all duration-300"
                        >
                            <HugeiconsIcon 
                                icon={MoreVerticalSquare01Icon} 
                                size={20}
                                />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white border border-gray-200 p-1 min-w-50">
                        <DropdownMenuGroup>
                            <DropdownMenuItem
                              className="hover:bg-gray-100 p-2 cursor-pointer"
                              onSelect={(event) => {
                                event.preventDefault()
                                setOpenEditDialog(true)
                              }}
                            >
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="p-2 cursor-pointer text-red-500 hover:bg-red-100"
                              onSelect={(event) => {
                                event.preventDefault()
                                setOpenDeleteDialog(true)
                              }}
                            >
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="mt-3">
                <div className="relative aspect-video w-full overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                  {thumbnailSrc ? (
                    <Image
                      src={thumbnailSrc}
                      alt={question.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-gray-500">
                      Belum ada thumbnail
                    </div>
                  )}
                </div>
                <div className="flex justify-start gap-1 text-sm font-semibold mt-5">
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
                <div className="font-medium text-lg line-clamp-1 mt-2">
                    {question.title}
                </div>
                <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {question.description}
                </div>
            </div>

            <div className="mt-5">
                <Link
                    href={`/studio/soal/detail?uuid=${question.uuid}`}
                    className="flex items-center justify-center gap-2 bg-pink-500 rounded-md py-2 text-white"
                >
                    <HugeiconsIcon icon={Share05Icon} size={20}/>
                    Detail
                </Link>
            </div>

            <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
              <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus Soal?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Soal yang dihapus tidak bisa dikembalikan lagi.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="bg-white">
                  <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    disabled={isDeleting}
                    onClick={handleDelete}
                  >
                    {isDeleting ? "Menghapus..." : "Hapus"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <DialogEditQuestion
              open={openEditDialog}
              onOpenChange={setOpenEditDialog}
              onUpdated={() => router.refresh()}
              question={{
                uuid: question.uuid,
                title: question.title,
                description: question.description,
                kpk_mode: question.kpk_mode,
                fpb_mode: question.fpb_mode,
                find_number: question.find_number,
                public_access: question.public_access,
                assistant_3d: question["3d_assistant"],
              }}
            />
        </div>
    )
}
