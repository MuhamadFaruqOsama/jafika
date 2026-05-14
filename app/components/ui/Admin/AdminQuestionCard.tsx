import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVerticalSquare01Icon, Share05Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { QRGenerator } from "./QRGenerator"

export function AdminQuestionCard() {
    return (
        <div className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-sm">
            <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">08 May 2026</div>
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
                    <DropdownMenuContent className="bg-white border border-gray-200 p-2 min-w-50">
                        <DropdownMenuGroup>
                            <DropdownMenuItem className="hover:bg-gray-100 p-2 cursor-pointer">
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-red-100 hover:text-red-600 p-2 cursor-pointer">
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="mt-3">
                <div className="font-medium text-lg line-clamp-2">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quidem sint doloremque soluta corporis molestias aperiam repellendus, veniam eligendi reprehenderit suscipit?
                </div>
                <div className="text-sm text-gray-600 mt-2">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatem beatae, atque laborum vel velit exercitationem aspernatur tenetur rem nobis corporis, autem repellat voluptatibus sequi a tempore fugiat, magnam eius. Eligendi magnam minus aperiam maxime modi excepturi vel molestias voluptate hic a quae officiis labore, nostrum consequuntur ullam est enim eveniet.
                </div>
            </div>

            <div className="mt-5">
                <Link
                    href={'soal/history'}
                    className="flex items-center justify-center gap-2 bg-pink-500 rounded-md py-2 text-white"
                >
                    <HugeiconsIcon icon={Share05Icon} size={20}/>
                    Detail
                </Link>
            </div>
        </div>
    )
}