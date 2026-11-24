"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// Lazy load modal PDF agar library react-pdf hanya didownload saat user membuka reader
const LazyPdfViewerModal = dynamic(
  () => import("./PdfViewerModal").then((mod) => mod.PdfViewerModal),
  {
    ssr: false,
    loading: () => null,
  }
);

type ReaderPDFProps = {
  pdfUrl?: string;
  title?: string;
  subtitle?: string;
  onOpen?: () => void;
};

export function ReaderPDF({
  pdfUrl = "/documents/BAHAN%20AJAR%20JAFIKA.pdf",
  title = "Baca Materi KPK & FPB",
  subtitle = "Baca dokumen terkait materi KPK & FPB.",
  onOpen,
}: ReaderPDFProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(true);
    onOpen?.();
  };

  return (
    <>
      <button
        className="w-full cursor-pointer rounded-md p-3 text-left hover:bg-gray-100 dark:hover:bg-slate-800/60 transition"
        type="button"
        onClick={handleClick}
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-lg font-bold text-gray-800 dark:text-gray-100">
            <i className="hgi hgi-stroke hgi-rounded hgi-pdf-01" />
            {title}
          </div>
          <small className="text-sm text-gray-500 dark:text-gray-400">
            {subtitle}
          </small>
        </div>
      </button>

      {isOpen && (
        <LazyPdfViewerModal
          open={isOpen}
          onOpenChange={setIsOpen}
          pdfUrl={pdfUrl}
          title={title}
          description={subtitle}
        />
      )}
    </>
  );
}
