import type { FactorPower } from "@/app/features/jafika/types/fpb";

type ExplanationLabel = "FPB" | "KPK";

type ExplanationInput = {
  label: ExplanationLabel;
  numbers: number[];
  factorStrings: string[];
  commonFactors: string;
  resultValue: number;
};

const SUPERSCRIPT_MAP: Record<string, string> = {
  "0": "⁰",
  "1": "¹",
  "2": "²",
  "3": "³",
  "4": "⁴",
  "5": "⁵",
  "6": "⁶",
  "7": "⁷",
  "8": "⁸",
  "9": "⁹",
};

function toSuperscript(value: number): string {
  return String(value)
    .split("")
    .map((digit) => SUPERSCRIPT_MAP[digit] ?? "")
    .join("");
}

export function formatFactorProduct(factors: FactorPower[]): string {
  if (!factors || factors.length === 0) return "-";
  return factors
    .map((factor) =>
      factor.exp > 1
        ? `${factor.prime}${toSuperscript(factor.exp)}`
        : String(factor.prime),
    )
    .join(" x ");
}

function buildFactorSentence(numbers: number[], factorStrings: string[]): string {
  if (numbers.length === 0) return "";
  const parts = numbers.map((number, index) => {
    const factorText = factorStrings[index] ?? "-";
    return `Faktor dari ${number} adalah ${factorText}`;
  });
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[0]} dan ${parts[1]}`;
  return `${parts.slice(0, -1).join(", ")}, dan ${parts[parts.length - 1]}`;
}

const FPB_TEMPLATES: Array<(input: ExplanationInput) => string> = [
  ({ numbers, factorStrings, commonFactors, resultValue }) =>
    `${buildFactorSentence(numbers, factorStrings)}. Faktor yang sama adalah ${commonFactors}. Nah, yang paling besar adalah ${resultValue}, jadi FPB-nya ${resultValue}.`,
  ({ numbers, factorStrings, commonFactors, resultValue }) =>
    `Kita cari FPB. ${buildFactorSentence(numbers, factorStrings)}. Ambil faktor yang sama: ${commonFactors}. Hasil FPB adalah ${resultValue}.`,
  ({ numbers, factorStrings, commonFactors, resultValue }) =>
    `${buildFactorSentence(numbers, factorStrings)}. Faktor yang sama itu ${commonFactors}. Yang paling besar nilainya ${resultValue}, jadi FPB = ${resultValue}.`,
  ({ numbers, factorStrings, commonFactors, resultValue }) =>
    `Langkah FPB: tulis faktor tiap bilangan. ${buildFactorSentence(numbers, factorStrings)}. Faktor yang sama: ${commonFactors}. FPB-nya ${resultValue}.`,
  ({ numbers, factorStrings, commonFactors, resultValue }) =>
    `Untuk FPB, kita cari faktor yang sama. ${buildFactorSentence(numbers, factorStrings)}. Faktor sama itu ${commonFactors}. Nilai paling besar adalah ${resultValue}.`,
  ({ numbers, factorStrings, commonFactors, resultValue }) =>
    `${buildFactorSentence(numbers, factorStrings)}. Faktor yang muncul di semua bilangan adalah ${commonFactors}. Jadi FPB = ${resultValue}.`,
  ({ numbers, factorStrings, commonFactors, resultValue }) =>
    `Ayo cari FPB dengan faktor. ${buildFactorSentence(numbers, factorStrings)}. Faktor yang sama: ${commonFactors}. FPB-nya adalah ${resultValue}.`,
  ({ numbers, factorStrings, commonFactors, resultValue }) =>
    `${buildFactorSentence(numbers, factorStrings)}. Semua faktor yang sama adalah ${commonFactors}. Yang terbesar ${resultValue}, jadi FPB = ${resultValue}.`,
  ({ numbers, factorStrings, commonFactors, resultValue }) =>
    `Kita bandingkan faktor tiap bilangan. ${buildFactorSentence(numbers, factorStrings)}. Faktor yang sama: ${commonFactors}. FPB hasilnya ${resultValue}.`,
  ({ numbers, factorStrings, commonFactors, resultValue }) =>
    `${buildFactorSentence(numbers, factorStrings)}. Faktor yang sama kita pilih: ${commonFactors}. Nilai terbesar itulah FPB, jadi ${resultValue}.`,
];

const KPK_TEMPLATES: Array<(input: ExplanationInput) => string> = [
  ({ numbers, factorStrings, commonFactors, resultValue }) =>
    `${buildFactorSentence(numbers, factorStrings)}. Faktor yang dipakai untuk KPK adalah ${commonFactors}. Nilai terkecil yang bisa dibagi semua bilangan adalah ${resultValue}, jadi KPK-nya ${resultValue}.`,
  ({ numbers, factorStrings, commonFactors, resultValue }) =>
    `Kita cari KPK. ${buildFactorSentence(numbers, factorStrings)}. Ambil faktor dengan pangkat terbesar: ${commonFactors}. KPK = ${resultValue}.`,
  ({ numbers, factorStrings, commonFactors, resultValue }) =>
    `${buildFactorSentence(numbers, factorStrings)}. Gabungkan faktor yang diperlukan: ${commonFactors}. Hasil KPK adalah ${resultValue}.`,
  ({ numbers, factorStrings, commonFactors, resultValue }) =>
    `Untuk KPK, kita ambil faktor terbesar dari tiap bilangan. ${buildFactorSentence(numbers, factorStrings)}. Faktornya menjadi ${commonFactors}.KPK-nya ${resultValue}.`,
  ({ numbers, factorStrings, commonFactors, resultValue }) =>
    `${buildFactorSentence(numbers, factorStrings)}. Faktor yang dipilih untuk KPK: ${commonFactors}. Nilai KPK adalah ${resultValue}.`,
  ({ numbers, factorStrings, commonFactors, resultValue }) =>
    `Langkah KPK: tulis faktor prima tiap bilangan. ${buildFactorSentence(numbers, factorStrings)}. Ambil yang pangkatnya paling besar: ${commonFactors}. KPK = ${resultValue}.`,
  ({ numbers, factorStrings, commonFactors, resultValue }) =>
    `${buildFactorSentence(numbers, factorStrings)}. Faktor untuk KPK digabung jadi ${commonFactors}. Hasil akhirnya ${resultValue}.`,
  ({ numbers, factorStrings, commonFactors, resultValue }) =>
    `KPK adalah kelipatan persekutuan terkecil. ${buildFactorSentence(numbers, factorStrings)}. Faktor yang kita pakai ${commonFactors}. KPK-nya ${resultValue}.`,
  ({ numbers, factorStrings, commonFactors, resultValue }) =>
    `${buildFactorSentence(numbers, factorStrings)}. Kita ambil faktor terbesar tiap bilangan: ${commonFactors}. Nilai KPK = ${resultValue}.`,
  ({ numbers, factorStrings, commonFactors, resultValue }) =>
    `Cari KPK dengan faktor. ${buildFactorSentence(numbers, factorStrings)}. Gabungan faktor terbesarnya ${commonFactors}. Jadi KPK = ${resultValue}.`,
];

export function getExplanationTemplateCount(label: ExplanationLabel): number {
  return label === "KPK" ? KPK_TEMPLATES.length : FPB_TEMPLATES.length;
}

export function buildExplanationText(
  input: ExplanationInput,
  templateIndex: number,
): string {
  const templates = input.label === "KPK" ? KPK_TEMPLATES : FPB_TEMPLATES;
  const safeIndex = Math.max(0, templateIndex) % templates.length;
  return templates[safeIndex](input);
}
