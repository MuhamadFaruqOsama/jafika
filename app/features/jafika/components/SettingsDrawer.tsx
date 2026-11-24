import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ReaderPDF } from "./ReaderPDF";
import { InstructionsDialog } from "./InstructionsDialog";
import { ProfileDialog } from "./ProfileDialog";
import { ScrollArea } from "@/components/ui/scroll-area";

type SettingsDrawerProps = {
  open: boolean;
  onClose: () => void;
  onReset: () => void;
  onOpenObjectModal: () => void;
  soundEffectEnabled: boolean;
  onToggleSoundEffect: (enabled: boolean) => void;
  backsoundEnabled: boolean;
  onToggleBacksound: (enabled: boolean) => void;
  showAiAssistant?: boolean;
  assistant3dEnabled?: boolean;
  onToggleAssistant3d?: (enabled: boolean) => void;
};

type ToggleRowProps = {
  title: string;
  subtitle: string;
  iconClass: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

function ToggleRow({
  title,
  subtitle,
  iconClass,
  checked,
  onCheckedChange,
}: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between rounded-md p-3 hover:bg-gray-100 dark:hover:bg-slate-800/60">
      <div className="flex flex-col justify-start gap-1">
        <div className="flex items-center gap-2 text-lg font-bold text-gray-800 dark:text-gray-100">
          <i className={iconClass} />
          {title}
        </div>
        <small className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</small>
      </div>
      <label className="inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          defaultChecked={checked === undefined ? true : undefined}
          onChange={(event) => onCheckedChange?.(event.target.checked)}
        />
        <div
          className="relative h-6 w-12 rounded-full bg-pink-100 after:absolute after:left-0.5 after:top-0.5
            after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-['']
            peer-checked:bg-pink-500 peer-checked:after:translate-x-6"
        />
      </label>
    </div>
  );
}


export function SettingsDrawer({
  open,
  onClose,
  onReset,
  onOpenObjectModal,
  soundEffectEnabled,
  onToggleSoundEffect,
  backsoundEnabled,
  onToggleBacksound,
  showAiAssistant = true,
  assistant3dEnabled = true,
  onToggleAssistant3d,
}: SettingsDrawerProps) {
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/20" onClick={onClose} />}
      <div
        id="drawer-settings-jafika"
        className={`fixed left-0 top-0 z-40 h-dvh max-h-screen w-96 border-e border-gray-200 bg-white p-3 flex flex-col transition-transform dark:border-slate-700 dark:bg-black overflow-hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-4 pb-3 flex items-center justify-between border-b border-gray-200 dark:border-slate-700 shrink-0">
          <h5
            id="drawer-label"
            className="inline-flex items-center gap-3 text-xl font-medium dark:text-gray-100"
          >
            <i className="hgi hgi-stroke hgi-settings-01" />
            <span>
              <span className="font-bold text-pink-500">JAFIKA</span> Settings
            </span>
          </h5>
          <button
            type="button"
            className="flex items-center justify-center h-9 w-9 rounded text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-slate-800"
            onClick={onClose}
            aria-label="Close menu"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={20} strokeWidth={3} />
          </button>
        </div>
        <div className="flex-1 min-h-0 w-full overflow-hidden">
          <ScrollArea className="h-full w-full" type="always">
            <div className="flex flex-col gap-3 pr-3.5 pb-6">
              <ReaderPDF/>
              <InstructionsDialog/>
              <button
                className="cursor-pointer rounded-md p-3 text-left hover:bg-gray-100 dark:hover:bg-slate-800/60"
                type="button"
                onClick={() => {
                  onReset();
                  onClose();
                }}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-lg font-bold text-gray-800 dark:text-gray-100">
                    <i className="hgi hgi-stroke hgi-clock-04" />
                    Mulai Dari Awal
                  </div>
                  <small className="text-sm text-gray-500 dark:text-gray-400">
                    Reset semua bilangan dan langkah pembagian.
                  </small>
                </div>
              </button>
              {/* <button
                className="cursor-pointer rounded-md p-3 text-left hover:bg-gray-100 dark:hover:bg-slate-800/60"
                type="button"
                onClick={onClose}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-lg font-bold text-gray-800 dark:text-gray-100">
                    <i className="hgi hgi-stroke hgi-pencil-edit-02" />
                    Buat Soal
                  </div>
                  <small className="text-sm text-gray-500 dark:text-gray-400">
                    Buat custom soal Anda sendiri.
                  </small>
                </div>
              </button> */}
              <button
                className="cursor-pointer rounded-md p-3 text-left hover:bg-gray-100 dark:hover:bg-slate-800/60"
                type="button"
                onClick={onOpenObjectModal}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-lg font-bold text-gray-800 dark:text-gray-100">
                    <i className="hgi hgi-stroke hgi-apple-01" />
                    Pilih Objek
                  </div>
                  <small className="text-sm text-gray-500 dark:text-gray-400">
                    Pilih objek untuk memvisualisasikan pembagian.
                  </small>
                </div>
              </button>
              <ToggleRow
                title="Efek Suara"
                subtitle="Efek suara JAFIKA."
                iconClass="hgi hgi-stroke hgi-music-note-03"
                checked={soundEffectEnabled}
                onCheckedChange={onToggleSoundEffect}
              />
              <ToggleRow
                title="Backsound"
                subtitle="Backsound musik relaksasi."
                iconClass="hgi hgi-stroke hgi-music-note-03"
                checked={backsoundEnabled}
                onCheckedChange={onToggleBacksound}
              />
              {showAiAssistant && (
                <ToggleRow
                  title="3D Assistant"
                  subtitle="Model 3D sebagai pendamping belajar."
                  iconClass="hgi hgi-stroke hgi-ai-network"
                  checked={assistant3dEnabled}
                  onCheckedChange={onToggleAssistant3d}
                />
              )}
              {/* <ToggleRow
                title="Dark Mode"
                subtitle="Simpan preferensi mode gelap di perangkat ini."
                iconClass="hgi hgi-stroke hgi-moon-02"
                checked={darkMode}
                onCheckedChange={onToggleDarkMode}
              /> */}
              <div className="pt-2 border-t border-gray-200 dark:border-slate-800">
                <ProfileDialog />
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
