"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, ExternalLink } from "lucide-react";

type PdfViewerModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pdfUrl?: string;
  title?: string;
  description?: string;
};

export function PdfViewerModal({
  open,
  onOpenChange,
  pdfUrl = "/documents/BAHAN%20AJAR%20JAFIKA.pdf",
  title = "Bahan Ajar JAFIKA - KPK & FPB",
  description = "Baca dan pelajari materi KPK & FPB melalui reader bawaan.",
}: PdfViewerModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[96vw] max-w-[96vw] sm:max-w-[96vw] md:max-w-[94vw] lg:max-w-[92vw] h-[92vh] max-h-[94vh] flex flex-col p-0 gap-0 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Formal */}
        <DialogHeader className="px-5 py-3 border-b border-gray-200 dark:border-gray-800 flex flex-row items-center justify-between shrink-0 bg-gray-50/90 dark:bg-[#121214]/90">
          <div className="flex flex-col gap-0.5 pr-4 line-clamp-1">
            <DialogTitle className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <i className="hgi hgi-stroke hgi-rounded hgi-pdf-01 text-pink-500 text-xl hidden sm:block" />
              <span>{title}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500 dark:text-gray-400">
              {description}
            </DialogDescription>
          </div>

          <div className="flex items-center gap-2 mr-8">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              title="Buka dokumen di tab baru browser"
            >
              <ExternalLink size={14} />
              <span>Buka Tab Baru</span>
            </a>
            <a
              href={pdfUrl}
              download
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-pink-500 text-white hover:bg-pink-600 transition shadow-sm"
              title="Unduh dokumen PDF"
            >
              <Download size={14} />
              <span className="hidden sm:block">Unduh PDF</span>
            </a>
          </div>
        </DialogHeader>

        {/* PDF Reader Bawaan Browser */}
        <div className="flex-1 w-full h-full min-h-0 bg-neutral-100 dark:bg-neutral-900 overflow-hidden relative">
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=1&view=FitH`}
            title={title}
            className="w-full h-full border-0"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
