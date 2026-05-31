"use client"

import { useEffect, useMemo, useState } from "react"
import { createClient } from "@/lib/client"
import { AdminTable, type ParticipantRow } from "./AdminTable"

type ParticipantRealtimeTableProps = {
  initialRows: ParticipantRow[]
  questionId?: number
  questionIds?: number[]
  questionTitleById?: Record<number, string>
  questionTitle?: string
  maxRows?: number
}

type RealtimeChangePayload = {
  eventType?: "INSERT" | "UPDATE" | "DELETE"
  new?: {
    id?: number
    question_id?: number
    name?: string
    start?: string | null
    finish?: string | null
  }
  old?: {
    id?: number
    question_id?: number
  }
}

function createRowFromPayload(
  payload: RealtimeChangePayload,
  questionTitleById: Record<number, string>,
  fallbackQuestionTitle: string | undefined,
): ParticipantRow | null {
  const participantId = Number(payload.new?.id)
  const questionId = Number(payload.new?.question_id)

  if (!Number.isInteger(participantId) || participantId <= 0) return null
  if (!Number.isInteger(questionId) || questionId <= 0) return null

  const questionTitle = questionTitleById[questionId] ?? fallbackQuestionTitle ?? "-"

  return {
    id: participantId,
    name: payload.new?.name ?? "-",
    questionTitle,
    start: payload.new?.start ?? null,
    finish: payload.new?.finish ?? null,
  }
}

export function ParticipantRealtimeTable({
  initialRows,
  questionId,
  questionIds = [],
  questionTitleById = {},
  questionTitle,
  maxRows,
}: ParticipantRealtimeTableProps) {
  const [rows, setRows] = useState<ParticipantRow[]>(initialRows)
  const monitoredQuestionIds = useMemo(() => new Set(questionIds), [questionIds])

  useEffect(() => {
    setRows(initialRows)
  }, [initialRows])

  useEffect(() => {
    if (!questionId && monitoredQuestionIds.size === 0) return

    const supabase = createClient()
    const channel = supabase
      .channel(`participant-realtime-${questionId ?? "home"}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "question_participant",
          ...(questionId ? { filter: `question_id=eq.${questionId}` } : {}),
        },
        (payload: RealtimeChangePayload) => {
          if (!questionId) {
            const incomingQuestionId =
              Number(payload.new?.question_id ?? payload.old?.question_id)
            if (!Number.isInteger(incomingQuestionId) || !monitoredQuestionIds.has(incomingQuestionId)) {
              return
            }
          }

          setRows((currentRows) => {
            const eventType = payload.eventType ?? "UPDATE"
            const participantId = Number(payload.new?.id ?? payload.old?.id)
            if (!Number.isInteger(participantId) || participantId <= 0) {
              return currentRows
            }

            if (eventType === "DELETE") {
              return currentRows.filter((row) => row.id !== participantId)
            }

            const nextRow = createRowFromPayload(payload, questionTitleById, questionTitle)
            if (!nextRow) return currentRows

            const existingIndex = currentRows.findIndex((row) => row.id === nextRow.id)
            if (existingIndex === -1) {
              const nextRows = [nextRow, ...currentRows]
              return typeof maxRows === "number" && maxRows > 0
                ? nextRows.slice(0, maxRows)
                : nextRows
            }

            const nextRows = [...currentRows]
            nextRows[existingIndex] = {
              ...nextRows[existingIndex],
              ...nextRow,
            }
            return nextRows
          })
        },
      )
      .subscribe((status: string) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.warn("Participant realtime channel issue:", status)
        }
      })

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [maxRows, monitoredQuestionIds, questionId, questionIds, questionTitle, questionTitleById])

  return <AdminTable rows={rows} />
}
