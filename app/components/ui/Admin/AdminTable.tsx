import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type ParticipantRow = {
  id: number
  name: string
  questionTitle: string
  start: string | null
  finish: string | null
}

type AdminTableProps = {
  rows?: ParticipantRow[]
}

function formatDateTime(value: string | null) {
  if (!value) return "-"

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "-"

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function AdminTable({ rows = [] }: AdminTableProps) {
    return (
        <div className="border border-gray-200 rounded-md p-2">
            <Table className="text-base">
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-bold">No</TableHead>
                        <TableHead className="font-bold">Nama</TableHead>
                        <TableHead className="font-bold">Soal</TableHead>
                        <TableHead className="font-bold">Status</TableHead>
                        <TableHead className="font-bold">Waktu Mulai</TableHead>
                        <TableHead className="font-bold">Waktu Selesai</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="text-gray-600">
                    {rows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-sm text-gray-500">
                          Belum ada peserta yang mengerjakan soal ini.
                        </TableCell>
                      </TableRow>
                    ) : (
                      rows.map((row, index) => {
                        const isFinished = Boolean(row.finish)
                        return (
                          <TableRow key={row.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.questionTitle}</TableCell>
                            <TableCell>
                              <span
                                className={`py-0.5 px-3 rounded-full text-sm ${
                                  isFinished
                                    ? "text-green-700 bg-green-100"
                                    : "text-orange-700 bg-orange-100"
                                }`}
                              >
                                {isFinished ? "selesai" : "belum selesai"}
                              </span>
                            </TableCell>
                            <TableCell>{formatDateTime(row.start)}</TableCell>
                            <TableCell>{formatDateTime(row.finish)}</TableCell>
                          </TableRow>
                        )
                      })
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
