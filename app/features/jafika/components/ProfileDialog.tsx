"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ProfileDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="w-full cursor-pointer rounded-md p-3 text-left hover:bg-gray-100 dark:hover:bg-slate-800/60 transition"
        type="button"
        onClick={() => setOpen(true)}
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-base font-bold text-gray-800 dark:text-gray-100">
            <i className="hgi hgi-stroke hgi-user" />
            Profil Pembuat
          </div>
          <small className="text-sm text-gray-500 dark:text-gray-400">
            Profil pengembang dan dosen pembimbing.
          </small>
        </div>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[94vw] max-w-4xl sm:max-w-3xl md:max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 shrink-0 bg-gray-50/80 dark:bg-[#121214]/80">
            <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <i className="hgi hgi-stroke hgi-user text-pink-500" />
              Profil Pembuat
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500 dark:text-gray-400">
              Informasi dosen pembimbing dan pengembang media pembelajaran JAFIKA.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
            {/* Profil Pengembang */}
            <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start bg-gray-50/90 dark:bg-[#121214]/90 p-3 rounded-2xl border border-gray-200 dark:border-gray-800">
              <Image
                src="/img/credits/alifah.jpeg"
                alt="Alifah Fitria Nugraheni"
                width={160}
                height={200}
                className="w-32 h-40 sm:w-36 sm:h-48 object-cover rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm shrink-0"
              />
              <div className="flex-1 space-y-2 text-left">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
                    Profil Pengembang
                  </h3>
                  <div className="font-semibold text-sm text-pink-600 dark:text-pink-400 mt-0.5">
                    Alifah Fitria Nugraheni
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
                  Mahasiswa Program Studi Pendidikan Guru Sekolah Dasar (PGSD), Universitas Negeri Semarang. Penulis merupakan pengembang media pembelajaran digital JAFIKA (Jago Faktorisasi dan Kelipatan) yang dikembangkan sebagai media pembelajaran materi KPK dan FPB untuk murid kelas V sekolah dasar. JAFIKA dirancang untuk membantu murid memahami konsep faktorisasi prima, KPK, dan FPB melalui pembelajaran yang interaktif, visual, dan mudah digunakan.
                </p>
              </div>
            </div>

            {/* Profil Dosen Pembimbing */}
            <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start bg-gray-50/90 dark:bg-[#121214]/90 p-3 rounded-2xl border border-gray-200 dark:border-gray-800">
              <Image
                src="/img/credits/pak%20yuli.jpeg"
                alt="Drs. Yuli Witanto, M.Pd."
                width={160}
                height={200}
                className="w-32 h-40 sm:w-36 sm:h-48 object-cover rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm shrink-0"
              />
              <div className="flex-1 space-y-2 text-left">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
                  Profil Dosen Pembimbing
                </h3>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
                  Drs. Yuli Witanto, M.Pd. merupakan dosen dan peneliti di Universitas Negeri Semarang (UNNES), Fakultas Ilmu Pendidikan dan Psikologi (FIPP), khususnya pada Program Studi Pendidikan Guru Sekolah Dasar (PGSD). Beliau menjabat sebagai Lektor Kepala dan memiliki bidang fokus pada pendidikan matematika, pembelajaran sekolah dasar, serta pengembangan media pembelajaran. Dalam pengembangan media pembelajaran digital JAFIKA (Jago Faktorisasi dan Kelipatan), beliau berperan sebagai dosen pembimbing yang memberikan arahan dan bimbingan dalam proses pengembangan media pembelajaran untuk materi KPK dan FPB.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
