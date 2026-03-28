import { useEffect, useMemo, useState } from "react";
import { buildSelectionKey } from "@/app/features/jafika/hooks/useFpbGame";
import type { FactorPower } from "@/app/features/jafika/types/fpb";
import {
  buildExplanationText,
  formatFactorProduct,
  getExplanationTemplateCount,
} from "@/app/features/jafika/lib/explanationTemplates";
import FPBImage from "@/public/img/fpb.png";
import KPKImage from "@/public/img/kpk.png";
import { Cancel01Icon, CheckmarkCircle03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";

type FactorSelectionCardProps = {
  id: string;
  variant: "FPB" | "KPK";
  promptTitle: string;
  factorOptions: FactorPower[][];
  selectedFactors: Record<string, boolean>;
  onToggle: (groupIndex: number, prime: number, exp: number) => void;
  onCheck: () => void;
  explanationVisible?: boolean;
  explanationNumbers?: number[];
  explanationResultValue?: number;
  explanationFaktorList?: FactorPower[];
  explanationLabel?: "FPB" | "KPK";
};

export function FactorSelectionCard({
  id,
  variant,
  promptTitle,
  factorOptions,
  selectedFactors,
  onToggle,
  onCheck,
  explanationVisible = false,
  explanationNumbers = [],
  explanationResultValue = 0,
  explanationFaktorList = [],
  explanationLabel = "FPB",
}: FactorSelectionCardProps) {
  const [templateIndex, setTemplateIndex] = useState(0);

  useEffect(() => {
    if (!explanationVisible) return;
    const totalTemplates = getExplanationTemplateCount(explanationLabel);
    setTemplateIndex(Math.floor(Math.random() * totalTemplates));
  }, [explanationVisible, explanationLabel]);

  const cardImage = variant === "KPK" ? KPKImage : FPBImage;
  const explanationText = useMemo(() => {
    if (!explanationVisible) return "";
    const factorStrings = explanationNumbers.map((_, index) =>
      formatFactorProduct(factorOptions[index] ?? []),
    );
    const commonFactorsText = formatFactorProduct(explanationFaktorList);
    return buildExplanationText(
      {
        label: explanationLabel,
        numbers: explanationNumbers,
        factorStrings,
        commonFactors: commonFactorsText,
        resultValue: explanationResultValue,
      },
      templateIndex,
    );
  }, [
    explanationVisible,
    explanationNumbers,
    factorOptions,
    explanationFaktorList,
    explanationLabel,
    explanationResultValue,
    templateIndex,
  ]);

  return (
    <div id={id}>
      <div className="mt-7 bg-pink-100 px-3 pb-5 pt-3 dark:bg-pink-500/30 rounded-4xl border border-pink-200 relative">
        <Image
          src={cardImage}
          alt={`${variant} Image`}
          width={190}
          height={190}
          className="absolute -top-10 -left-3"
        />
      
        <div className="mb-5 bg-pink-500 py-2 px-6 w-fit rounded-full font-semibold text-white ms-40">
          {promptTitle}
        </div>

        <div className="grid gap-4 md:grid-cols-2 mt-7">
          {factorOptions.map((options, groupIndex) => (
            <div key={groupIndex} className="mb-3 md:mb-0">
              <div className="mb-2 text-gray-800 dark:text-white">
                Faktor Bilangan {explanationNumbers[groupIndex] ?? groupIndex + 1}:
              </div>
              <ul className="flex gap-3">
                {options.map((factor, index) => {
                  const key = buildSelectionKey(
                    groupIndex,
                    factor.prime,
                    factor.exp,
                  );

                  return (
                    <div className="flex items-center gap-3">
                      <li key={key}>
                        <label
                          className={`flex cursor-pointer relative flex-col items-center justify-center border-2 bg-white rounded-full w-14 h-14 font-extrabold transition-all dark:bg-black ${
                            selectedFactors[key]
                              ? "border-pink-500 text-pink-500"
                              : "border-gray-700 hover:bg-gray-100 hover:text-pink-500 dark:border-gray-600 dark:text-white hover:border-pink-500"
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={Boolean(selectedFactors[key])}
                            onChange={() =>
                              onToggle(groupIndex, factor.prime, factor.exp)
                            }
                          />
                          <span className="text-lg">
                            {factor.prime}
                            {factor.exp > 1 && <sup>{factor.exp}</sup>}
                          </span>
                        </label>
                      </li>
                      {index < options.length - 1 && (
                        <HugeiconsIcon icon={Cancel01Icon} size={20} strokeWidth={4} className="text-pink-500" />
                      )}
                    </div>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="p-2 mt-10">
          {!explanationVisible && (
            <button
              className="w-full cursor-pointer rounded-full border-2 border-pink-500 bg-white py-2 font-semibold text-pink-500 transition-all duration-300 shadow-3d"
              type="button"
              onClick={onCheck}
            >
              Cek Jawaban
            </button>
          )}
        </div>

        {explanationVisible && (
          <>
            <div className="mb-2 bg-pink-500 py-2 px-6 w-fit rounded-full font-semibold text-white">
              Penjelasan
            </div>
            
            <div className="rounded-2xl bg-pink-500/20 p-4 text-gray-900 whitespace-pre-line">
              {explanationText}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
