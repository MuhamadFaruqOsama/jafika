"use client"

import { useEffect, useMemo, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"

type ParticipantRealtimeRefresherProps = {
  questionId?: number
  questionIds?: number[]
  debounceMs?: number
}

type ParticipantPayload = {
  new: {
    question_id?: number
  }
  old: {
    question_id?: number
  }
}

export function ParticipantRealtimeRefresher({
  questionId,
  questionIds = [],
  debounceMs = 400,
}: ParticipantRealtimeRefresherProps) {
  const router = useRouter()
  const refreshTimeoutRef = useRef<number | null>(null)
  const monitoredQuestionIds = useMemo(() => new Set(questionIds), [questionIds])

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
        (payload) => {
          const eventPayload = payload as unknown as ParticipantPayload
          if (!questionId) {
            const incomingQuestionId =
              eventPayload.new.question_id ?? eventPayload.old.question_id
            if (!incomingQuestionId || !monitoredQuestionIds.has(incomingQuestionId)) {
              return
            }
          }

          if (refreshTimeoutRef.current !== null) {
            window.clearTimeout(refreshTimeoutRef.current)
          }
          refreshTimeoutRef.current = window.setTimeout(() => {
            router.refresh()
          }, debounceMs)
        },
      )
      .subscribe()

    return () => {
      if (refreshTimeoutRef.current !== null) {
        window.clearTimeout(refreshTimeoutRef.current)
      }
      void supabase.removeChannel(channel)
    }
  }, [debounceMs, monitoredQuestionIds, questionId, router])

  return null
}
