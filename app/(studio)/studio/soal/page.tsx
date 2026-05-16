import { AdminHeader } from "@/app/components/ui/Admin/AdminHeader";
import { AdminQuestionCard } from "@/app/components/ui/Admin/AdminQuestionCard";
import { DialogAddQuestion } from "@/app/components/ui/Admin/DialogAddQuestion";
import { createClient } from "@/lib/server";

type QuestionRow = {
  id: number;
  uuid: string;
  title: string;
  description: string;
  kpk_mode: boolean;
  fpb_mode: boolean;
  find_number: unknown;
  thumbnail: string | null;
  public_access: boolean;
  "3d_assistant": boolean;
  created_at: string;
};

export default async function Soal() {
    const supabase = await createClient();
    const { data: questions } = await supabase
      .from("question")
      .select('id, uuid, title, description, kpk_mode, fpb_mode, find_number, thumbnail, public_access, "3d_assistant", created_at')
      .order("created_at", { ascending: false });

    const questionList: QuestionRow[] = questions ?? [];

    return (
        <>
            <AdminHeader title="Soal" />

            {/* add button */}
            <div className="flex justify-end">
                <DialogAddQuestion/>
            </div>

            {/* soal list */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {questionList.length === 0 ? (
                  <div className="col-span-full rounded-lg mt-5 border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">
                    Belum ada soal. Tambahkan soal pertama Anda.
                  </div>
                ) : (
                  questionList.map((question) => (
                    <AdminQuestionCard
                      key={question.id}
                      question={question}
                    />
                  ))
                )}
            </div>
        </>
    )
}
