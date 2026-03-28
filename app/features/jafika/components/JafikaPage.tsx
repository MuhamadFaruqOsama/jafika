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
import { HugeiconsIcon } from "@hugeicons/react";
import { MinusSignCircleIcon, PlusSignCircleIcon } from "@hugeicons/core-free-icons";
import Image from "next/image";

export function JafikaPage() {
  const [loading, setLoading] = useState(true);
  const [showStartOverlay, setShowStartOverlay] = useState(false);
  const [showFinishOverlay, setShowFinishOverlay] = useState(false);
  const game = useFpbGame();
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
  const finishOverlayTimeoutRef = useRef<number | null>(null);
  const hasShownFinishOverlayRef = useRef(false);
  const labelNumbers = game.numberInputs.map((value, index) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isInteger(parsed) ? parsed : index + 1;
  });
  const previewNumbers = game.numberInputs
    .map((value) => Number.parseInt(value, 10))
    .filter((value) => Number.isInteger(value) && value > 0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!game.isFinished) {
      hasShownFinishOverlayRef.current = false;
      if (finishOverlayTimeoutRef.current !== null) {
        window.clearTimeout(finishOverlayTimeoutRef.current);
        finishOverlayTimeoutRef.current = null;
      }
      setShowFinishOverlay(false);
      return;
    }

    if (hasShownFinishOverlayRef.current) return;
    hasShownFinishOverlayRef.current = true;
    setShowFinishOverlay(true);

    if (game.isSoundEffectEnabled) {
      const voiceAudio = finishVoiceRef.current;
      if (voiceAudio) {
        voiceAudio.currentTime = 0;
        void voiceAudio.play().catch(() => {
          // Browser dapat memblokir autoplay sebelum interaksi user.
        });
      }
    }

    finishOverlayTimeoutRef.current = window.setTimeout(() => {
      setShowFinishOverlay(false);
      finishOverlayTimeoutRef.current = null;
    }, 3500);
    return () => {
      if (finishOverlayTimeoutRef.current !== null) {
        window.clearTimeout(finishOverlayTimeoutRef.current);
        finishOverlayTimeoutRef.current = null;
      }
    };
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

  const handleStartDistribution = () => {
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
      />

      {game.hasStartedDistribution && !showStartOverlay && (
        <NumberPreviewBar numbers={previewNumbers} />
      )}

      <div className="flex w-full max-w-screen-2xl flex-col md:flex-row pb-80">
        <div
          className={`w-full px-3 md:px-6 ${game.hasStartedDistribution ? "mt-5 pt-5" : "mt-20"}`}
        >
          {(!game.hasStartedDistribution || showStartOverlay) && (
            <div className="">
              <div className="shadow-sm mb-2 bg-pink-500 py-2 px-6 w-fit rounded-full font-semibold text-white">
                Masukkan bilangan dulu sebelum memulai yaa
              </div>
              <div className="bg-white border border-gray-200 shadow-sm px-4 py-6 rounded-4xl  dark:bg-black/40 dark:border-gray-800/50">
                <div className="flex justify-end gap-3 mb-10">
                  <Button variant="secondary" onClick={game.addNumberInput}>
                    {/* <HugeiconsIcon icon={PlusSignCircleIcon} size={20} strokeWidth={3} /> */}
                    Tambah Bilangan
                  </Button>
                  <Button variant="secondary" onClick={game.removeNumberInput}>
                    {/* <HugeiconsIcon icon={MinusSignCircleIcon} size={20} strokeWidth={3} /> */}
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
                  >
                    Mulai
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

          {game.isFinished && (
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

          {game.showExplanation && (
            <FactorSelectionCard
              id="hasil-kpk"
              variant="KPK"
              promptTitle="Lanjutkan: pilih faktor KPK di bawah ini."
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
        darkMode={game.themeMode === "dark"}
        onToggleDarkMode={game.toggleDarkMode}
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
