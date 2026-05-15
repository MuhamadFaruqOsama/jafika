import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function AdminTable() {
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
                    <TableRow>
                        <TableCell>1</TableCell>
                        <TableCell>John Doe</TableCell>
                        <TableCell>Soal 1</TableCell>
                        <TableCell>
                            <span className="py-0.5 px-3 rounded-full text-sm text-green-700 bg-green-100">selesai</span>
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-col">
                                <div className="text-base">20 May 2026</div>
                                <div className="text-sm text-gray-500">10:00 AM</div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-col">
                                <div className="text-base">20 May 2026</div>
                                <div className="text-sm text-gray-500">11:00 AM</div>
                            </div>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>2</TableCell>
                        <TableCell>John Doe</TableCell>
                        <TableCell>Soal 1</TableCell>
                        <TableCell>
                            <span className="py-0.5 px-3 rounded-full text-sm text-orange-700 bg-red-100">belum selesai</span>
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-col">
                                <div className="text-base">20 May 2026</div>
                                <div className="text-sm text-gray-500">10:00 AM</div>
                            </div>
                        </TableCell>
                        <TableCell>
                            -
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}