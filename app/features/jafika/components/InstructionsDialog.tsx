"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const INSTRUCTIONS = [
  "Tentukan jenisnya dulu, yuk! Apakah KPK atau FPB?",
  "Tentukan bilangannya. Masukkan bilangan yang terdapat pada soal.",
  "Cari bilangan pembaginya, yuk! Tentukan bilangan yang dapat membagi setiap bilangan pada soal.",
  "Uraikan ke faktor prima. Uraikan setiap bilangan menggunakan bilangan prima.",
  "Tentukan hasilnya. Tentukan KPK atau FPB sesuai jenis yang dipilih.",
];

export function InstructionsDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="w-full cursor-pointer rounded-md p-3 text-left hover:bg-gray-100 dark:hover:bg-slate-800/60 transition"
        type="button"
        onClick={() => setOpen(true)}
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-lg font-bold text-gray-800 dark:text-gray-100">
            <i className="hgi hgi-stroke hgi-help-circle" />
            Petunjuk
          </div>
          <small className="text-sm text-gray-500 dark:text-gray-400">
            Petunjuk langkah pengerjaan.
          </small>
        </div>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[92vw] max-w-lg sm:max-w-lg p-6 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Petunjuk
            </DialogTitle>
            <DialogDescription className="sr-only">
              Petunjuk langkah pengerjaan
            </DialogDescription>
          </DialogHeader>

          <ol className="list-decimal list-outside pl-5 space-y-3 text-sm text-gray-700 dark:text-gray-300">
            {INSTRUCTIONS.map((instruction, index) => (
              <li key={index} className="leading-relaxed">
                {instruction}
              </li>
            ))}
          </ol>
        </DialogContent>
      </Dialog>
    </>
  );
}
