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

const REVERSE_SUPERSCRIPT_MAP: Record<string, string> = {
  "⁰": "0",
  "¹": "1",
  "²": "2",
  "³": "3",
  "⁴": "4",
  "⁵": "5",
  "⁶": "6",
  "⁷": "7",
  "⁸": "8",
  "⁹": "9",
};

function toSuperscript(value: number): string {
  return String(value)
    .split("")
    .map((digit) => SUPERSCRIPT_MAP[digit] ?? "")
    .join("");
}

function fromSuperscript(str: string): number {
  const digits = str
    .split("")
    .map((c) => REVERSE_SUPERSCRIPT_MAP[c] ?? "")
    .join("");
  return digits ? Number.parseInt(digits, 10) : 1;
}

export function formatFactorProduct(factors: FactorPower[]): string {
  if (!factors || factors.length === 0) return "-";
  return factors
    .map((factor) =>
      factor.exp > 1
        ? `${factor.prime}${toSuperscript(factor.exp)}`
        : String(factor.prime),
    )
    .join(" × ");
}

function parseFactorTerm(term: string): {
  base: number;
  exp: number;
  value: number;
  formattedExpanded: string;
} {
  const match = term.match(/^(\d+)([⁰¹²³⁴⁵⁶⁷⁸⁹]*)$/);
  if (!match) {
    return { base: 1, exp: 1, value: 1, formattedExpanded: term };
  }
  const base = Number.parseInt(match[1], 10);
  const exp = match[2] ? fromSuperscript(match[2]) : 1;
  const value = Math.pow(base, exp);
  return { base, exp, value, formattedExpanded: String(value) };
}

function buildCalculationChain(factorStr: string, resultValue: number): string {
  if (!factorStr || factorStr === "-") return String(resultValue);
  const rawTerms = factorStr
    .split(/\s*[\u00d7x]\s*/)
    .map((t) => t.trim())
    .filter(Boolean);
  if (rawTerms.length === 0) return String(resultValue);

  const parsedTerms = rawTerms.map(parseFactorTerm);
  const hasExponentGreaterThanOne = parsedTerms.some((t) => t.exp > 1);
  const isSingleTerm = parsedTerms.length === 1;

  if (isSingleTerm) {
    if (parsedTerms[0].exp > 1) {
      return `${factorStr} = ${resultValue}`;
    }
    return String(resultValue);
  }

  if (hasExponentGreaterThanOne) {
    const intermediate = parsedTerms.map((t) => t.formattedExpanded).join(" × ");
    if (intermediate !== factorStr && intermediate !== String(resultValue)) {
      return `${factorStr} = ${intermediate} = ${resultValue}`;
    }
  }

  return `${factorStr} = ${resultValue}`;
}

function extractBasePrimes(factorStr: string): number[] {
  if (!factorStr || factorStr === "-") return [];
  const terms = factorStr.split(/\s*[\u00d7x]\s*/);
  const primes: number[] = [];
  for (const term of terms) {
    const match = term.match(/^(\d+)/);
    if (match) {
      const p = Number.parseInt(match[1], 10);
      if (!primes.includes(p)) {
        primes.push(p);
      }
    }
  }
  return primes;
}

function formatPrimeList(primes: number[]): string {
  if (primes.length === 0) return "tidak ada";
  if (primes.length === 1) return String(primes[0]);
  if (primes.length === 2) return `${primes[0]} dan ${primes[1]}`;
  return `${primes.slice(0, -1).join(", ")}, dan ${primes[primes.length - 1]}`;
}

function formatNumberList(numbers: number[]): string {
  if (numbers.length === 0) return "";
  if (numbers.length === 1) return String(numbers[0]);
  if (numbers.length === 2) return `${numbers[0]} dan ${numbers[1]}`;
  return `${numbers.slice(0, -1).join(", ")}, dan ${numbers[numbers.length - 1]}`;
}

function buildFactorSentence(numbers: number[], factorStrings: string[]): string {
  if (numbers.length === 0) return "";
  if (numbers.length === 1) {
    return `Faktorisasi prima dari ${numbers[0]} adalah ${factorStrings[0] ?? "-"}`;
  }
  const parts = numbers.map((number, index) => {
    const factorText = factorStrings[index] ?? "-";
    return index === 0
      ? `Faktorisasi prima dari ${number} adalah ${factorText}`
      : `dari ${number} adalah ${factorText}`;
  });
  if (parts.length === 2) {
    return `${parts[0]} dan ${parts[1]}`;
  }
  return `${parts.slice(0, -1).join(", ")}, dan ${parts[parts.length - 1]}`;
}

const FPB_TEMPLATES: Array<(input: ExplanationInput) => string> = [
  ({ numbers, factorStrings, commonFactors, resultValue }) => {
    const factorSentence = buildFactorSentence(numbers, factorStrings);
    const primes = formatPrimeList(extractBasePrimes(commonFactors));
    const calc = buildCalculationChain(commonFactors, resultValue);
    const numList = formatNumberList(numbers);
    const primesSentence =
      primes === "tidak ada"
        ? "Tidak ada faktor prima yang sama."
        : `Faktor prima yang sama adalah ${primes}.`;
    return `${factorSentence}. ${primesSentence} Untuk FPB, ambil pangkat terkecil: ${calc}. Jadi, FPB dari ${numList} adalah ${resultValue}.`;
  },
  ({ numbers, factorStrings, commonFactors, resultValue }) => {
    const factorSentence = buildFactorSentence(numbers, factorStrings);
    const primes = formatPrimeList(extractBasePrimes(commonFactors));
    const calc = buildCalculationChain(commonFactors, resultValue);
    const numList = formatNumberList(numbers);
    const primesSentence =
      primes === "tidak ada"
        ? "Tidak ada faktor prima yang sama."
        : `Faktor prima yang sama yaitu ${primes}.`;
    return `Langkah mencari FPB: ${factorSentence}. ${primesSentence} Ambil faktor dengan pangkat terkecil: ${calc}. Jadi, FPB dari ${numList} adalah ${resultValue}.`;
  },
  ({ numbers, factorStrings, commonFactors, resultValue }) => {
    const factorSentence = buildFactorSentence(numbers, factorStrings);
    const primes = formatPrimeList(extractBasePrimes(commonFactors));
    const calc = buildCalculationChain(commonFactors, resultValue);
    const numList = formatNumberList(numbers);
    const primesSentence =
      primes === "tidak ada"
        ? "tidak ada faktor prima yang sama"
        : `faktor prima yang sama adalah ${primes}`;
    return `${factorSentence}. Dari faktorisasi tersebut, ${primesSentence}. Untuk menentukan FPB, kalikan faktor prima yang sama dengan pangkat terkecil: ${calc}. Jadi, FPB dari ${numList} adalah ${resultValue}.`;
  },
  ({ numbers, factorStrings, commonFactors, resultValue }) => {
    const factorSentence = buildFactorSentence(numbers, factorStrings);
    const primes = formatPrimeList(extractBasePrimes(commonFactors));
    const calc = buildCalculationChain(commonFactors, resultValue);
    const numList = formatNumberList(numbers);
    const primesSentence =
      primes === "tidak ada"
        ? "Tidak ada faktor prima yang bersekutu."
        : `Faktor prima yang bersekutu (sama) adalah ${primes}.`;
    return `Kita cari FPB dari ${numList}. ${factorSentence}. ${primesSentence} Ambil pangkat terkecil: ${calc}. Maka, FPB dari ${numList} adalah ${resultValue}.`;
  },
  ({ numbers, factorStrings, commonFactors, resultValue }) => {
    const factorSentence = buildFactorSentence(numbers, factorStrings);
    const primes = formatPrimeList(extractBasePrimes(commonFactors));
    const calc = buildCalculationChain(commonFactors, resultValue);
    const numList = formatNumberList(numbers);
    const primesSentence =
      primes === "tidak ada"
        ? "tidak ada faktor prima yang sama"
        : `faktor prima yang sama adalah ${primes}`;
    return `${factorSentence}. Perhatikan ${primesSentence}. Kalikan faktor-faktor tersebut dengan pangkat terkecil: ${calc}. Dengan demikian, FPB dari ${numList} adalah ${resultValue}.`;
  },
];

const KPK_TEMPLATES: Array<(input: ExplanationInput) => string> = [
  ({ numbers, factorStrings, commonFactors, resultValue }) => {
    const factorSentence = buildFactorSentence(numbers, factorStrings);
    const primes = formatPrimeList(extractBasePrimes(commonFactors));
    const calc = buildCalculationChain(commonFactors, resultValue);
    const numList = formatNumberList(numbers);
    return `${factorSentence}. Faktor prima yang ada adalah ${primes}. Untuk KPK, ambil semua faktor dengan pangkat terbesar: ${calc}. Jadi, KPK dari ${numList} adalah ${resultValue}.`;
  },
  ({ numbers, factorStrings, commonFactors, resultValue }) => {
    const factorSentence = buildFactorSentence(numbers, factorStrings);
    const primes = formatPrimeList(extractBasePrimes(commonFactors));
    const calc = buildCalculationChain(commonFactors, resultValue);
    const numList = formatNumberList(numbers);
    return `Langkah mencari KPK: ${factorSentence}. Seluruh faktor prima yang muncul adalah ${primes}. Ambil faktor dengan pangkat terbesar: ${calc}. Jadi, KPK dari ${numList} adalah ${resultValue}.`;
  },
  ({ numbers, factorStrings, commonFactors, resultValue }) => {
    const factorSentence = buildFactorSentence(numbers, factorStrings);
    const primes = formatPrimeList(extractBasePrimes(commonFactors));
    const calc = buildCalculationChain(commonFactors, resultValue);
    const numList = formatNumberList(numbers);
    return `${factorSentence}. Dari faktorisasi tersebut, faktor prima yang digunakan yaitu ${primes}. Untuk menentukan KPK, kalikan semua faktor prima dengan pangkat terbesar: ${calc}. Jadi, KPK dari ${numList} adalah ${resultValue}.`;
  },
  ({ numbers, factorStrings, commonFactors, resultValue }) => {
    const factorSentence = buildFactorSentence(numbers, factorStrings);
    const primes = formatPrimeList(extractBasePrimes(commonFactors));
    const calc = buildCalculationChain(commonFactors, resultValue);
    const numList = formatNumberList(numbers);
    return `Kita cari KPK dari ${numList}. ${factorSentence}. Kumpulkan semua faktor prima yaitu ${primes}. Ambil faktor dengan pangkat terbesar: ${calc}. Maka, KPK dari ${numList} adalah ${resultValue}.`;
  },
  ({ numbers, factorStrings, commonFactors, resultValue }) => {
    const factorSentence = buildFactorSentence(numbers, factorStrings);
    const primes = formatPrimeList(extractBasePrimes(commonFactors));
    const calc = buildCalculationChain(commonFactors, resultValue);
    const numList = formatNumberList(numbers);
    return `${factorSentence}. Perhatikan semua faktor prima yang ada, yaitu ${primes}. Kalikan seluruh faktor dengan pangkat terbesar: ${calc}. Dengan demikian, KPK dari ${numList} adalah ${resultValue}.`;
  },
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
