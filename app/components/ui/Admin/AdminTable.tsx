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
                    <TableRow className="font-semibold">
                        <TableHead>No</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Soal</TableHead>
                        <TableHead>Waktu Mulai</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="text-gray-600">
                    <TableRow>
                        <TableCell>1</TableCell>
                        <TableCell>John Doe</TableCell>
                        <TableCell>Soal 1</TableCell>
                        <TableCell>2023-10-01 10:00:00</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>1</TableCell>
                        <TableCell>John Doe</TableCell>
                        <TableCell>Soal 1</TableCell>
                        <TableCell>2023-10-01 10:00:00</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}