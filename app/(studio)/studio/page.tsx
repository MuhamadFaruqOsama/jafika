import { AdminHeader } from "../../components/ui/Admin/AdminHeader";
import { ParticipantRealtimeTable } from "../../components/ui/Admin/ParticipantRealtimeTable";
import { LastQuestionCardAdmin } from "../../components/ui/Admin/LastQuestionCardAdmin";
import { TotalQuestionCardAdmin } from "../../components/ui/Admin/TotalQuestionCardAdmin";
import { createClient } from "@/lib/server";

type QuestionRow = {
  id: number;
  uuid: string;
  title: string;
  created_at: string;
};

type ParticipantRow = {
  id: number;
  question_id: number;
  name: string;
  start: string | null;
  finish: string | null;
};

function formatDateLabel(value: string | null | undefined) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

export default async function Dashboard() {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    const authUserId = authData.user?.id;

    const { data: questions } = authUserId
      ? await supabase
          .from("question")
          .select("id, uuid, title, created_at")
          .eq("user_id", authUserId)
          .order("created_at", { ascending: false })
      : { data: [] as QuestionRow[] };

    const questionList: QuestionRow[] = questions ?? [];
    const questionIdList = questionList.map((question) => question.id);

    const { data: participants } = questionIdList.length > 0
      ? await supabase
          .from("question_participant")
          .select("id, question_id, name, start, finish")
          .in("question_id", questionIdList)
          .order("id", { ascending: false })
          .limit(15)
      : { data: [] as ParticipantRow[] };

    const participantRows: ParticipantRow[] = participants ?? [];
    const questionTitleById = new Map(questionList.map((question) => [question.id, question.title]));
    const questionTitleLookup = Object.fromEntries(questionTitleById.entries());
    const latestQuestion = questionList[0];

    const { count: totalWorkedCount } = questionIdList.length > 0
      ? await supabase
          .from("question_participant")
          .select("id", { count: "exact", head: true })
          .in("question_id", questionIdList)
      : { count: 0 };

    const { count: latestQuestionWorkedCount } = latestQuestion
      ? await supabase
          .from("question_participant")
          .select("id", { count: "exact", head: true })
          .eq("question_id", latestQuestion.id)
      : { count: 0 };

    return (
        <>
            <AdminHeader title="Home" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="col-span-1 md:col-span-2 border bg-white border-gray-200 p-2 rounded-lg">
                    <div className="text-gray-900 my-3 text-lg font-medium flex items-center gap-3">
                        Pengguna yang Terakhir Mengerjakan Soal Anda
                    </div>
                    <ParticipantRealtimeTable
                      initialRows={participantRows.map((participant) => ({
                        id: participant.id,
                        name: participant.name,
                        start: participant.start,
                        finish: participant.finish,
                        questionTitle: questionTitleById.get(participant.question_id) ?? "-",
                      }))}
                      questionIds={questionIdList}
                      questionTitleById={questionTitleLookup}
                      maxRows={15}
                    />
                </div>
                <div className="col-span-1 space-y-3">
                    <LastQuestionCardAdmin
                      latestCreatedAtLabel={formatDateLabel(latestQuestion?.created_at)}
                      latestQuestionWorkedBy={latestQuestionWorkedCount ?? 0}
                      latestQuestionUuid={latestQuestion?.uuid}
                    />
                    <TotalQuestionCardAdmin
                      totalQuestion={questionList.length}
                      totalWorked={totalWorkedCount ?? 0}
                    />
                </div>
            </div>
        </>
    )
}
