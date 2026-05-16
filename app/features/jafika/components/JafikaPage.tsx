"use client";

import { useEffect, useRef, useState } from "react";
import { OBJECT_OPTIONS } from "@/app/features/jafika/lib/constants";
import { useFpbGame } from "@/app/features/jafika/hooks/useFpbGame";
import { DivisionStepCard } from "@/app/features/jafika/components/DivisionStepCard";
import { FactorSelectionCard } from "@/app/features/jafika/components/FactorSelectionCard";
import { LoaderOverlay } from "@/app/features/jafika/components/LoaderOverlay";
import { Navbar } from "@/app/components/ui/Navbar";
import { NumberInputList } from "@/app/features/jafika/components/NumberInputList";
import { ObjectPickerModal } from "@/app/features/jafika/components/ObjectPickerModal";
import { SettingsDrawer } from "@/app/features/jafika/components/SettingsDrawer";
import { NumberPreviewBar } from "@/app/features/jafika/components/NumberPreviewBar";
import { Toaster } from "@/components/ui/sonner";
import Button from "@/app/components/ui/Button";
import Image from "next/image";
import { toast } from "sonner";
import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { MaterialDownload } from "@/app/components/ui/MaterialDownload";

export type JafikaShareConfig = {
  enabled: true;
  questionUuid: string;
  participantId: number;
  participantName: string;
  sessionStorageKey: string;
  title: string;
  description: string;
  thumbnail: string | null;
  expectedInputCount: number;
  kpkMode: boolean;
  fpbMode: boolean;
  assistant3dEnabled: boolean;
};

type JafikaPageProps = {
  shareConfig?: JafikaShareConfig;
};

export function JafikaPage({ shareConfig }: JafikaPageProps) {
  const isShareMode = shareConfig?.enabled === true;
  const expectedInputCount = isShareMode ? shareConfig.expectedInputCount : 0;
  const hasLockedInputCount = isShareMode && expectedInputCount >= 2;
  const isFpbModeEnabled = isShareMode ? shareConfig.fpbMode : true;
  const isKpkModeEnabled = isShareMode ? shareConfig.kpkMode : true;
  const showAiAssistantSetting = !(isShareMode && shareConfig?.assistant3dEnabled === false);
  const [loading, setLoading] = useState(true);
  const [showStartOverlay, setShowStartOverlay] = useState(false);
  const [showFinishOverlay, setShowFinishOverlay] = useState(false);
  const [isShareStarting, setIsShareStarting] = useState(false);
  const game = useFpbGame({
    initialInputCount: hasLockedInputCount ? expectedInputCount : undefined,
    lockInputCount: hasLockedInputCount,
  });
  const backsoundRef = useRef<HTMLAudioElement | null>(null);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);
  const distributionSoundRef = useRef<HTMLAudioElement | null>(null);
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const startSoundRef = useRef<HTMLAudioElement | null>(null);
  const magicSoundRef = useRef<HTMLAudioElement | null>(null);
  const invalidSoundRef = useRef<HTMLAudioElement | null>(null);
  const finishVoiceRef = useRef<HTMLAudioElement | null>(null);
  const lastDistributionTickRef = useRef(0);
  const lastCorrectTickRef = useRef(0);
  const lastInvalidTickRef = useRef(0);
  const lastInvalidAtRef = useRef(0);
  const pendingClickTimeoutRef = useRef<number | null>(null);
  const hasPlayedFinishVoiceRef = useRef(false);
  const hasMarkedShareFinishRef = useRef(false);
  const labelNumbers = game.numberInputs.map((value, index) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isInteger(parsed) ? parsed : index + 1;
  });
  const previewNumbers = game.numberInputs
    .map((value) => Number.parseInt(value, 10))
    .filter((value) => Number.isInteger(value) && value > 0);
  const shouldAskFpb = isFpbModeEnabled;
  const shouldAskKpk = isKpkModeEnabled;
  const fpbCompleted = !shouldAskFpb || game.showExplanation;
  const kpkCompleted = !shouldAskKpk || game.showKpkExplanation;
  const isShareCompleted =
    isShareMode &&
    game.isFinished &&
    fpbCompleted &&
    kpkCompleted;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!game.isFinished) {
      hasPlayedFinishVoiceRef.current = false;
      return;
    }

    if (hasPlayedFinishVoiceRef.current) return;
    hasPlayedFinishVoiceRef.current = true;

    if (game.isSoundEffectEnabled) {
      const voiceAudio = finishVoiceRef.current;
      if (voiceAudio) {
        voiceAudio.currentTime = 0;
        void voiceAudio.play().catch(() => {
          // Browser dapat memblokir autoplay sebelum interaksi user.
        });
      }
    }
  }, [game.isFinished, game.isSoundEffectEnabled]);

  useEffect(() => {
    if (!game.isFinished) {
      setShowFinishOverlay(false);
      return;
    }

    setShowFinishOverlay(true);
    const timeout = window.setTimeout(() => {
      setShowFinishOverlay(false);
    }, 2000);

    return () => window.clearTimeout(timeout);
  }, [game.isFinished]);

  useEffect(() => {
    const audio = backsoundRef.current;
    if (!audio) return;

    if (game.isBacksoundEnabled) {
      void audio.play().catch(() => {
        // Browser dapat memblokir autoplay sebelum interaksi user.
      });
      return;
    }

    audio.pause();
  }, [game.isBacksoundEnabled]);

  useEffect(() => {
    if (!game.isSoundEffectEnabled) {
      lastDistributionTickRef.current = game.distributionTick;
      return;
    }

    if (game.distributionTick <= lastDistributionTickRef.current) return;
    lastDistributionTickRef.current = game.distributionTick;

    const audio = distributionSoundRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    void audio.play().catch(() => {
      // Browser dapat memblokir autoplay sebelum interaksi user.
    });
  }, [game.distributionTick, game.isSoundEffectEnabled]);

  useEffect(() => {
    if (!game.isSoundEffectEnabled) {
      lastCorrectTickRef.current = game.correctTick;
      return;
    }

    if (game.correctTick <= lastCorrectTickRef.current) return;
    lastCorrectTickRef.current = game.correctTick;

    const audio = correctSoundRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    void audio.play().catch(() => {
      // Browser dapat memblokir autoplay sebelum interaksi user.
    });
  }, [game.correctTick, game.isSoundEffectEnabled]);

  useEffect(() => {
    if (!game.isSoundEffectEnabled) {
      lastInvalidTickRef.current = game.invalidTick;
      return;
    }

    if (game.invalidTick <= lastInvalidTickRef.current) return;
    lastInvalidTickRef.current = game.invalidTick;

    const audio = invalidSoundRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    void audio.play().catch(() => {
      // Browser dapat memblokir autoplay sebelum interaksi user.
    });

    lastInvalidAtRef.current = performance.now();
    if (pendingClickTimeoutRef.current !== null) {
      window.clearTimeout(pendingClickTimeoutRef.current);
      pendingClickTimeoutRef.current = null;
    }
  }, [game.invalidTick, game.isSoundEffectEnabled]);

  useEffect(() => {
    const handleButtonClick = (event: MouseEvent) => {
      if (!game.isSoundEffectEnabled) return;

      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (target.closest('[data-sfx="none"]')) return;
      if (!target.closest("button") && !target.closest('input[type="checkbox"]')) {
        return;
      }

      const clickAt = performance.now();
      if (pendingClickTimeoutRef.current !== null) {
        window.clearTimeout(pendingClickTimeoutRef.current);
      }

      pendingClickTimeoutRef.current = window.setTimeout(() => {
        pendingClickTimeoutRef.current = null;
        if (!game.isSoundEffectEnabled) return;
        if (lastInvalidAtRef.current > clickAt) return;

        const audio = clickSoundRef.current;
        if (!audio) return;

        audio.currentTime = 0;
        void audio.play().catch(() => {
          // Browser dapat memblokir autoplay sebelum interaksi user.
        });
      }, 60);
    };

    document.addEventListener("click", handleButtonClick, true);
    return () => {
      document.removeEventListener("click", handleButtonClick, true);
      if (pendingClickTimeoutRef.current !== null) {
        window.clearTimeout(pendingClickTimeoutRef.current);
        pendingClickTimeoutRef.current = null;
      }
    };
  }, [game.isSoundEffectEnabled]);

  useEffect(() => {
    if (!isShareCompleted || !shareConfig) return;
    if (hasMarkedShareFinishRef.current) return;
    hasMarkedShareFinishRef.current = true;

    const markFinished = async () => {
      try {
        const response = await fetch(`/api/share/${shareConfig.questionUuid}/participant`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "finish",
            participantId: shareConfig.participantId,
          }),
        });

        if (!response.ok) {
          const payload = (await response.json()) as { error?: string };
          toast.error(payload.error ?? "Gagal menandai peserta selesai.");
          return;
        }

        toast.success("Selamat! Kamu sudah menyelesaikan soal.");
      } catch {
        toast.error("Terjadi kendala jaringan saat menyimpan status selesai.");
      }
    };

    void markFinished();
  }, [isShareCompleted, shareConfig]);

  const handleStartDistribution = async () => {
    if (isShareMode && shareConfig) {
      const parsedNumbers = game.numberInputs.map((value) => Number.parseInt(value, 10));
      const isValid = parsedNumbers.every((value) => Number.isInteger(value) && value > 0);

      if (!isValid || parsedNumbers.length !== expectedInputCount) {
        toast.error("Isi semua bilangan dengan benar dulu sebelum mulai.");
        return;
      }

      setIsShareStarting(true);
      try {
        const response = await fetch(`/api/share/${shareConfig.questionUuid}/participant`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "start",
            participantId: shareConfig.participantId,
            numbers: parsedNumbers,
          }),
        });

        if (!response.ok) {
          const payload = (await response.json()) as { error?: string };
          if (response.status === 404) {
            window.localStorage.removeItem(shareConfig.sessionStorageKey);
            window.location.reload();
            return;
          }
          toast.error(payload.error ?? "Belum bisa memulai sesi.");
          return;
        }
      } catch {
        toast.error("Terjadi kendala jaringan saat memulai sesi.");
        return;
      } finally {
        setIsShareStarting(false);
      }
    }

    const started = game.startDistribution();
    if (!started) return;

    if (game.isSoundEffectEnabled) {
      const startAudio = startSoundRef.current;
      if (startAudio) {
        startAudio.currentTime = 0;
        void startAudio.play().catch(() => {
          // Browser dapat memblokir autoplay sebelum interaksi user.
        });
      }

      const magicAudio = magicSoundRef.current;
      if (magicAudio) {
        magicAudio.currentTime = 0;
        void magicAudio.play().catch(() => {
          // Browser dapat memblokir autoplay sebelum interaksi user.
        });
      }
    }

    setShowStartOverlay(true);
    window.setTimeout(() => {
      setShowStartOverlay(false);
    }, 2000);
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-100 dark:bg-[#121212]">
      <LoaderOverlay visible={loading} />
      <audio ref={backsoundRef} src="/audio/backsound.mp3" loop autoPlay hidden />
      <audio ref={clickSoundRef} src="/audio/soundEffect/click.mp3" preload="auto" hidden />
      <audio
        ref={distributionSoundRef}
        src="/audio/soundEffect/distribution.mp3"
        preload="auto"
        hidden
      />
      <audio ref={correctSoundRef} src="/audio/soundEffect/correct.mp3" preload="auto" hidden />
      <audio ref={startSoundRef} src="/audio/speech/ayo-mulai.mp3" preload="auto" hidden />
      <audio ref={magicSoundRef} src="/audio/soundEffect/magic.mp3" preload="auto" hidden />
      <audio ref={invalidSoundRef} src="/audio/soundEffect/invalid.mp3" preload="auto" hidden />
      <audio ref={finishVoiceRef} src="/audio/speech/tentuin-jawaban.mp3" preload="auto" hidden />

      {showStartOverlay && (
        <div className="fixed inset-0 z-9999999 flex items-center justify-center bg-black/50">
          <Image
            src="/img/ayo-mulai.png"
            alt="Ayo Mulai"
            width={1500}
            height={1500}
            className="ayo-mulai-zoom w-56 md:w-80"
          />
        </div>
      )}

      {showFinishOverlay && (
        <div className="fixed inset-0 z-9999999 flex items-center justify-center bg-black/50">
          <Image
            src="/img/tentuin-jawaban.png"
            alt="Tentuin Jawaban"
            width={1500}
            height={1500}
            className="division-overlay-text w-64 md:w-96"
          />
        </div>
      )}

      <Navbar
        onOpenSettings={() => game.setSettingsOpen(true)}
        hideAuthAction={isShareMode}
      />

      {game.hasStartedDistribution && !showStartOverlay && (
        <NumberPreviewBar numbers={previewNumbers} />
      )}

      <div className="flex w-full max-w-screen-2xl flex-col md:flex-row pb-80">
        <div
          className={`w-full px-3 md:px-6 ${game.hasStartedDistribution ? "mt-5 pt-5" : "mt-20"}`}
        >
          {isShareMode && shareConfig && (
            <>
              <div className="shadow-sm mb-2 bg-pink-500 py-2 px-6 w-fit rounded-full font-semibold text-white">
                Soal Sharing
              </div>
              <div className="rounded-4xl border border-gray-200 bg-white p-4 shadow-sm mb-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                      {shareConfig.thumbnail ? (
                        <Image
                          src={shareConfig.thumbnail}
                          alt={shareConfig.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-gray-500">
                          Belum ada thumbnail
                        </div>
                      )}
                    </div>
                    <MaterialDownload/>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{shareConfig.title}</h2>
                    <p className="mt-2 text-gray-700">{shareConfig.description}</p>
                    <p className="mt-3 text-gray-600">
                      Peserta: <span>{shareConfig.participantName}</span>
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {(!game.hasStartedDistribution || showStartOverlay) && (
            <div className="">
              <div className="shadow-sm mb-2 bg-pink-500 py-2 px-6 w-fit rounded-full font-semibold text-white">
                {
                  isShareMode && shareConfig ? 'Mari pecahkan masalah tersebut' : 'Masukkan bilangan dulu sebelum memulai yaa'
                }
              </div>
              <div className="bg-white border border-gray-200 shadow-sm px-4 py-6 rounded-4xl  dark:bg-black/40 dark:border-gray-800/50">
                {/* menentukan apakah kpk atau fpb */}
                {
                  isShareMode && shareConfig && (
                    <>
                      <div className="px-4 py-1 bg-pink-100 text-black rounded-full w-fit">
                        1. Tentuin jenis faktorisasinya dulu yaa
                      </div>
                      <small className="text-gray-500 ms-3">Berdasarkan soal tersebut, faktorisasi mana yang tepat? Apakah KPK? atau FPB? atau dua-duanya?</small>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <FieldLabel>
                          <Field orientation="horizontal">
                            <Checkbox id="kpk" name="kpk" />
                            <FieldContent>
                              <FieldTitle>KPK</FieldTitle>
                              <FieldDescription>
                                Kelipatan Persekutuan Terkecil.
                              </FieldDescription>
                            </FieldContent>
                          </Field>
                        </FieldLabel>
                        <FieldLabel>
                          <Field orientation="horizontal">
                            <Checkbox id="fpb" name="fpb" />
                            <FieldContent>
                              <FieldTitle>FPB</FieldTitle>
                              <FieldDescription>
                                Faktor Persekutuan Terbesar.
                              </FieldDescription>
                            </FieldContent>
                          </Field>
                        </FieldLabel>
                      </div>

                      <div className="px-4 py-1 bg-pink-100 text-black rounded-full w-fit mt-10">
                        2. Lalu Tentuin bilangannya
                      </div>
                      <small className="text-gray-500 ms-3">Tentukan ada berapa bilangan yang difaktorisasi dan berapa saja ya kira-kira?</small>
                    </>
                  )
                }
                
                {/* {!hasLockedInputCount && (
                  <div className="flex justify-end gap-3 mb-10">
                    <Button variant="secondary" onClick={game.addNumberInput}>
                      Tambah Bilangan
                    </Button>
                    <Button variant="secondary" onClick={game.removeNumberInput}>
                      Hapus Bilangan
                    </Button>
                  </div>
                )} */}
                <div className="flex justify-end gap-3">
                  <Button variant="secondary" onClick={game.addNumberInput}>
                    Tambah Bilangan
                  </Button>
                  <Button variant="secondary" onClick={game.removeNumberInput}>
                    Hapus Bilangan
                  </Button>
                </div>
                <NumberInputList
                  values={game.numberInputs}
                  locked={game.isNumbersLocked}
                  onChange={game.setInputValue}
                />
                <div className="mt-5">
                  <Button
                    variant="secondary"
                    data-sfx="none"
                    className="w-full justify-center rounded-full py-2 text-xl font-bold"
                    onClick={handleStartDistribution}
                    disabled={isShareStarting}
                  >
                    {isShareStarting ? "Memvalidasi..." : "Mulai"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div id="angka-pembagi">
            {game.steps.map((step) => (
              <DivisionStepCard
                key={step.step}
                step={step}
                imageUrl={game.selectedImageUrl}
                totalNumbers={game.numberInputs.length}
                labelNumbers={labelNumbers}
              />
            ))}

            {game.hasStartedDistribution && !showStartOverlay && !game.isFinished && (
              <div
                id={`angka-pembagi-${game.steps.length + 1}`}
                className="mb-2 rounded-4xl bg-white border border-gray-200 shadow-sm p-4 dark:bg-pink-500/70"
              >
                <small className="text-gray-800 dark:text-white">{game.steps.length + 1}.</small>
                <div className="flex justify-center">
                  <div className="mb-2">
                    <label
                      htmlFor={`angka_pembagi_${game.steps.length + 1}`}
                      className="ms-3 mb-1 dark:text-white"
                    >
                      Masukkan angka pembagi
                    </label>
                    <input
                      id={`angka_pembagi_${game.steps.length + 1}`}
                      type="number"
                      min={2}
                      value={game.currentDividerInput}
                      onChange={(event) => {
                        const value = event.target.value;
                        game.setCurrentDividerInput(value);
                        if (value.trim() !== "") {
                          game.submitDivider(value);
                        }
                      }}
                      className="rounded-full border-3 border-pink-500 bg-gray-50 px-4 py-2 focus:outline-pink-500 dark:text-white dark:bg-black w-full focus:shadow-lg shadow-pink-500/50 outline-none"
                      placeholder={game.steps.length === 0 ? "contoh: 2" : "contoh: 3"}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {game.isFinished && shouldAskFpb && (
            <FactorSelectionCard
              id="hasil-fpb"
              variant="FPB"
              promptTitle="Pilih faktor FPB di bawah ini."
              factorOptions={game.factorOptions}
              selectedFactors={game.selectedFactors}
              onToggle={game.toggleFactor}
              onCheck={game.checkAnswer}
              explanationVisible={game.showExplanation}
              explanationNumbers={game.originalNumbers}
              explanationResultValue={game.expectedAnswer.product}
              explanationFaktorList={game.expectedAnswer.faktorList}
              explanationLabel="FPB"
            />
          )}

          {game.isFinished && shouldAskKpk && (!shouldAskFpb || game.showExplanation) && (
            <FactorSelectionCard
              id="hasil-kpk"
              variant="KPK"
              promptTitle={
                shouldAskFpb
                  ? "Lanjutkan: pilih faktor KPK di bawah ini."
                  : "Pilih faktor KPK di bawah ini."
              }
              factorOptions={game.factorOptions}
              selectedFactors={game.selectedKpkFactors}
              onToggle={game.toggleKpkFactor}
              onCheck={game.checkKpkAnswer}
              explanationVisible={game.showKpkExplanation}
              explanationNumbers={game.originalNumbers}
              explanationResultValue={game.expectedKpkAnswer.product}
              explanationFaktorList={game.expectedKpkAnswer.faktorList}
              explanationLabel="KPK"
            />
          )}

          {game.isFinished && fpbCompleted && kpkCompleted && (
            <div className="bg-green-100 text-green-900 text-lg py-2 text-center border border-green-200 rounded-xl mt-5">
              Selamat, Anda telah menyelesaikan soal
            </div>
          )}
        </div>
      </div>

      <SettingsDrawer
        open={game.settingsOpen}
        onClose={() => game.setSettingsOpen(false)}
        onReset={game.resetGame}
        onOpenObjectModal={() => {
          game.setSettingsOpen(false);
          game.setObjectModalOpen(true);
        }}
        soundEffectEnabled={game.isSoundEffectEnabled}
        onToggleSoundEffect={game.toggleSoundEffect}
        backsoundEnabled={game.isBacksoundEnabled}
        onToggleBacksound={game.toggleBacksound}
        showAiAssistant={showAiAssistantSetting}
      />

      <ObjectPickerModal
        open={game.objectModalOpen}
        options={OBJECT_OPTIONS}
        selectedObject={game.selectedObjectName}
        onSelect={(name) => game.setSelectedObjectName(name)}
        onClose={() => game.setObjectModalOpen(false)}
      />

      <Toaster position="bottom-right" richColors theme={game.themeMode} />
    </main>
  );
}
