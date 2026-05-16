"use client";

import { useEffect, useMemo, useState } from "react";
import { OBJECT_OPTIONS } from "@/app/features/jafika/lib/constants";
import {
  computeFPBFromFactors,
  computeKPKFromFactors,
  getFactorPowers,
  isPrime,
} from "@/app/features/jafika/lib/fpb";
import type { DivisionResult, DivisionStep } from "@/app/features/jafika/types/fpb";
import { toast } from "sonner";

const MIN_INPUT_COUNT = 2;
const THEME_STORAGE_KEY = "jafika-theme";
const BACKSOUND_STORAGE_KEY = "jafika-backsound-enabled";
const SOUND_EFFECT_STORAGE_KEY = "jafika-sound-effect-enabled";
type ThemeMode = "light" | "dark";

function createDefaultInputs(): string[] {
  return Array.from({ length: MIN_INPUT_COUNT }, () => "");
}

export function buildSelectionKey(
  groupIndex: number,
  prime: number,
  exp: number,
): string {
  return `${groupIndex}|${prime}|${exp}`;
}

export function useFpbGame() {
  const getInitialThemeMode = (): ThemeMode => {
    if (typeof window === "undefined") return "light";
    return window.localStorage.getItem(THEME_STORAGE_KEY) === "dark"
      ? "dark"
      : "light";
  };

  const getInitialBacksoundEnabled = () => {
    if (typeof window === "undefined") return true;
    const saved = window.localStorage.getItem(BACKSOUND_STORAGE_KEY);
    return saved === null ? true : saved === "true";
  };

  const getInitialSoundEffectEnabled = () => {
    if (typeof window === "undefined") return true;
    const saved = window.localStorage.getItem(SOUND_EFFECT_STORAGE_KEY);
    return saved === null ? true : saved === "true";
  };

  const [numberInputs, setNumberInputs] = useState<string[]>(createDefaultInputs);
  const [isNumbersLocked, setIsNumbersLocked] = useState(false);
  const [hasStartedDistribution, setHasStartedDistribution] = useState(false);
  const [currentDividerInput, setCurrentDividerInput] = useState("");
  const [workingNumbers, setWorkingNumbers] = useState<number[]>([]);
  const [factorLists, setFactorLists] = useState<number[][]>([]);
  const [finishedFlags, setFinishedFlags] = useState<boolean[]>([]);
  const [steps, setSteps] = useState<DivisionStep[]>([]);
  const [selectedObjectName, setSelectedObjectName] = useState("apple");
  const [selectedFactors, setSelectedFactors] = useState<Record<string, boolean>>(
    {},
  );
  const [selectedKpkFactors, setSelectedKpkFactors] = useState<
    Record<string, boolean>
  >({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [showKpkExplanation, setShowKpkExplanation] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialThemeMode);
  const [isBacksoundEnabled, setIsBacksoundEnabled] = useState(getInitialBacksoundEnabled);
  const [isSoundEffectEnabled, setIsSoundEffectEnabled] = useState(getInitialSoundEffectEnabled);
  const [distributionTick, setDistributionTick] = useState(0);
  const [correctTick, setCorrectTick] = useState(0);
  const [invalidTick, setInvalidTick] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [objectModalOpen, setObjectModalOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", themeMode === "dark");
    window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);
  }, [themeMode]);

  useEffect(() => {
    window.localStorage.setItem(BACKSOUND_STORAGE_KEY, String(isBacksoundEnabled));
  }, [isBacksoundEnabled]);

  useEffect(() => {
    window.localStorage.setItem(SOUND_EFFECT_STORAGE_KEY, String(isSoundEffectEnabled));
  }, [isSoundEffectEnabled]);

  const selectedImageUrl = useMemo(() => {
    return (
      OBJECT_OPTIONS.find((item) => item.name === selectedObjectName)?.url ??
      "/icon/apple.png"
    );
  }, [selectedObjectName]);

  const expectedAnswer = useMemo(
    () => computeFPBFromFactors(factorLists),
    [factorLists],
  );
  const expectedKpkAnswer = useMemo(
    () => computeKPKFromFactors(factorLists),
    [factorLists],
  );

  const factorOptions = useMemo(
    () => factorLists.map((factors) => getFactorPowers(factors)),
    [factorLists],
  );

  const isFinished = useMemo(() => {
    return finishedFlags.length > 0 && finishedFlags.every(Boolean);
  }, [finishedFlags]);

  const originalNumbers = useMemo(() => {
    if (steps.length === 0) return [];
    return factorLists.map((factors) => factors.reduce((acc, factor) => acc * factor, 1));
  }, [factorLists, steps.length]);

  function showError(message: string) {
    toast.error(message, { id: message });
    setInvalidTick((prev) => prev + 1);
  }

  function showSuccess(message: string) {
    toast.success(message);
  }

  function toggleDarkMode(isEnabled: boolean) {
    setThemeMode(isEnabled ? "dark" : "light");
  }

  function toggleBacksound(isEnabled: boolean) {
    setIsBacksoundEnabled(isEnabled);
  }

  function toggleSoundEffect(isEnabled: boolean) {
    setIsSoundEffectEnabled(isEnabled);
  }

  function parseNumberInputs(): number[] | null {
    const parsed = numberInputs.map((value) => Number.parseInt(value, 10));
    const isValid = parsed.every(
      (value) => Number.isInteger(value) && value > 0,
    );

    if (!isValid || parsed.length < MIN_INPUT_COUNT) {
      showError("Isi semua bilangan terlebih dahulu (minimal 2).");
      return null;
    }

    return parsed;
  }

  function setInputValue(index: number, value: string) {
    if (isNumbersLocked) return;

    setNumberInputs((prev) =>
      prev.map((item, itemIndex) => (itemIndex === index ? value : item)),
    );
  }

  function addNumberInput() {
    if (isNumbersLocked) {
      showError("Reset game dulu untuk mengubah jumlah bilangan.");
      return;
    }

    setNumberInputs((prev) => [...prev, ""]);
  }

  function removeNumberInput() {
    if (isNumbersLocked) {
      showError("Reset game dulu untuk mengubah jumlah bilangan.");
      return;
    }

    setNumberInputs((prev) => {
      if (prev.length <= MIN_INPUT_COUNT) {
        showError("Minimal jumlah bilangan adalah 2.");
        return prev;
      }

      return prev.slice(0, -1);
    });
  }

  function startDistribution() {
    if (hasStartedDistribution) return false;

    const parsedNumbers = parseNumberInputs();
    if (!parsedNumbers) return false;

    setNumberInputs(parsedNumbers.map((number) => String(number)));
    setIsNumbersLocked(true);
    setHasStartedDistribution(true);
    return true;
  }

  function submitDivider(rawDividerInput?: string) {
    const dividerText = rawDividerInput ?? currentDividerInput;
    const divider = Number.parseInt(dividerText, 10);

    if (!Number.isInteger(divider) || divider < 2) {
      showError("Masukkan angka pembagi valid (minimal 2).");
      return;
    }

    if (!isPrime(divider)) {
      showError("Angka pembagi harus bilangan prima.");
      return;
    }

    const baseNumbers =
      steps.length === 0 ? parseNumberInputs() : [...workingNumbers];

    if (!baseNumbers || baseNumbers.length === 0) {
      return;
    }

    const nextNumbers = [...baseNumbers];
    const nextFactors =
      steps.length === 0
        ? baseNumbers.map(() => [] as number[])
        : factorLists.map((group) => [...group]);
    const nextFinished =
      steps.length === 0 ? baseNumbers.map(() => false) : [...finishedFlags];

    const stepResults: DivisionResult[] = [];

    for (let index = 0; index < nextNumbers.length; index += 1) {
      if (nextFinished[index]) continue;

      const currentValue = nextNumbers[index];

      if (!isPrime(currentValue)) {
        if (currentValue % divider !== 0) {
          showError(
            `Bilangan ke-${index + 1} tidak bisa dibagi ${divider}. Pilih pembagi lain.`,
          );
          return;
        }

        const afterValue = currentValue / divider;
        nextNumbers[index] = afterValue;
        nextFactors[index].push(divider);

        stepResults.push({
          numberIndex: index,
          before: currentValue,
          after: afterValue,
          finished: false,
        });
      }
    }

    if (stepResults.length === 0) {
      showError("Tidak ada bilangan yang bisa dibagi lagi.");
      return;
    }

    for (let index = 0; index < nextNumbers.length; index += 1) {
      if (!nextFinished[index] && isPrime(nextNumbers[index])) {
        nextFinished[index] = true;
        nextFactors[index].push(nextNumbers[index]);
      }
    }

    const finalizedResults = stepResults.map((result) => ({
      ...result,
      finished: nextFinished[result.numberIndex],
    }));

    setWorkingNumbers(nextNumbers);
    setFactorLists(nextFactors);
    setFinishedFlags(nextFinished);
    setSteps((prev) => [
      ...prev,
      {
        step: prev.length + 1,
        divider,
        results: finalizedResults,
      },
    ]);
    setCurrentDividerInput("");
    setIsNumbersLocked(true);
    setSelectedFactors({});
    setSelectedKpkFactors({});
    setShowExplanation(false);
    setShowKpkExplanation(false);
    setDistributionTick((prev) => prev + 1);

    if (nextFinished.every(Boolean)) {
      showSuccess("Selesai. Silakan pilih faktor untuk cek jawaban.");
    }
  }

  function toggleFactor(groupIndex: number, prime: number, exp: number) {
    const key = buildSelectionKey(groupIndex, prime, exp);

    setSelectedFactors((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  function checkAnswer() {
    const hasilPerBilangan = factorLists.map((_, groupIndex) => {
      const selectedInGroup = Object.entries(selectedFactors).filter(
        ([key, checked]) => checked && key.startsWith(`${groupIndex}|`),
      );

      return selectedInGroup.reduce((acc, [key]) => {
        const [, primeText, expText] = key.split("|");
        const prime = Number.parseInt(primeText, 10);
        const exp = Number.parseInt(expText, 10);
        return acc * prime ** exp;
      }, 1);
    });

    const userAnswer = hasilPerBilangan.reduce(
      (acc, current) => acc * current,
      1,
    );

    if (userAnswer === expectedAnswer.product) {
      setShowExplanation(true);
      setSelectedKpkFactors({});
      setShowKpkExplanation(false);
      setCorrectTick((prev) => prev + 1);
      showSuccess("Jawaban benar!");
      return;
    }

    showError("Jawaban salah. Coba lagi.");
  }

  function toggleKpkFactor(groupIndex: number, prime: number, exp: number) {
    const key = buildSelectionKey(groupIndex, prime, exp);

    setSelectedKpkFactors((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  function checkKpkAnswer() {
    const hasilPerBilangan = factorLists.map((_, groupIndex) => {
      const selectedInGroup = Object.entries(selectedKpkFactors).filter(
        ([key, checked]) => checked && key.startsWith(`${groupIndex}|`),
      );

      return selectedInGroup.reduce((acc, [key]) => {
        const [, primeText, expText] = key.split("|");
        const prime = Number.parseInt(primeText, 10);
        const exp = Number.parseInt(expText, 10);
        return acc * prime ** exp;
      }, 1);
    });

    const userAnswer = hasilPerBilangan.reduce(
      (acc, current) => acc * current,
      1,
    );

    if (userAnswer === expectedKpkAnswer.product) {
      setShowKpkExplanation(true);
      setCorrectTick((prev) => prev + 1);
      showSuccess("Jawaban KPK benar!");
      return;
    }

    showError("Jawaban KPK salah. Coba lagi.");
  }

  function resetGame() {
    setNumberInputs(createDefaultInputs());
    setIsNumbersLocked(false);
    setHasStartedDistribution(false);
    setCurrentDividerInput("");
    setWorkingNumbers([]);
    setFactorLists([]);
    setFinishedFlags([]);
    setSteps([]);
    setSelectedFactors({});
    setSelectedKpkFactors({});
    setShowExplanation(false);
    setShowKpkExplanation(false);
    showSuccess("Berhasil direset.");
  }

  return {
    numberInputs,
    isNumbersLocked,
    hasStartedDistribution,
    currentDividerInput,
    setCurrentDividerInput,
    steps,
    factorLists,
    factorOptions,
    selectedImageUrl,
    selectedObjectName,
    setSelectedObjectName,
    selectedFactors,
    selectedKpkFactors,
    expectedAnswer,
    expectedKpkAnswer,
    isFinished,
    showExplanation,
    showKpkExplanation,
    isBacksoundEnabled,
    isSoundEffectEnabled,
    distributionTick,
    correctTick,
    invalidTick,
    themeMode,
    settingsOpen,
    setSettingsOpen,
    objectModalOpen,
    setObjectModalOpen,
    originalNumbers,
    toggleDarkMode,
    toggleBacksound,
    toggleSoundEffect,
    setInputValue,
    addNumberInput,
    removeNumberInput,
    startDistribution,
    submitDivider,
    toggleFactor,
    toggleKpkFactor,
    checkAnswer,
    checkKpkAnswer,
    resetGame,
  };
}
