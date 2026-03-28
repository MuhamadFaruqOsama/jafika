import type { DivisionStep } from "@/app/features/jafika/types/fpb";
import { CheckmarkCircle03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type DivisionStepCardProps = {
  step: DivisionStep;
  imageUrl: string;
  totalNumbers: number;
  labelNumbers: number[];
};

function renderObjectCopies(count: number, imageUrl: string) {
  return Array.from({ length: Math.max(0, count) }).map((_, index) => (
    <img key={index} src={imageUrl} className="w-10" alt="Objek pembagian" />
  ));
}

export function DivisionStepCard({
  step,
  imageUrl,
  totalNumbers,
  labelNumbers,
}: DivisionStepCardProps) {
  const slots = Array.from({ length: totalNumbers }, (_, index) => {
    return step.results.find((result) => result.numberIndex === index) ?? null;
  });

  return (
    <div id={`angka-pembagi-${step.step}`} className="mb-2 rounded-4xl bg-white border border-gray-200 dark:bg-pink-500/30 p-4">
      <small className="text-gray-800 dark:text-white">{step.step}.</small>

      <div className="flex justify-center">
        <div className="mb-3">
          <label htmlFor={`angka_pembagi_${step.step}`} className="ms-3 mb-1 dark:text-white">
            Masukkan angka pembagi
          </label>
          <input
            id={`angka_pembagi_${step.step}`}
            type="number"
            value={step.divider}
            readOnly
            className="rounded-full border-3 border-pink-500 bg-gray-50 px-4 py-2 focus:outline-pink-500 dark:text-white dark:bg-black w-full focus:shadow-lg shadow-pink-500/50 outline-none"
          />
        </div>
      </div>

      <div id={`result_${step.step}`} className="mt-2 flex flex-wrap gap-3">
        {slots.map((result, index) => {
          if (!result) {
            return (
              <div
                key={`placeholder-${index}`}
                className="hidden min-w-55 flex-1 md:block"
                aria-hidden="true"
              />
            );
          }

          return (
            <div key={result.numberIndex} className="min-w-55 flex-1 ">
              <small className="text-gray-700 dark:text-gray-100 ms-3">
                Bilangan {labelNumbers[result.numberIndex] ?? result.numberIndex + 1}
              </small>
              <div className="rounded-2xl bg-pink-500/10 p-3 dark:bg-black/50">
                <div className="font-medium bg-pink-500/30 w-fit py-1 px-3 rounded-full text-black mb-3 text-sm">
                  Sebelum dibagi: {result.before}
                </div>
                <div className="mb-2 flex flex-wrap gap-3">
                  {renderObjectCopies(result.before, imageUrl)}
                </div>

                <div className="my-2 flex items-center justify-center">
                  <span className="text-4xl leading-none font-bold text-pink-500">
                    &darr;
                  </span>
                </div>

                <div className="flex gap-2 items-center">
                  <div className="font-medium bg-pink-500/30 w-fit py-1 px-3 rounded-full text-black mb-3 text-sm">
                    Setelah dibagi: {result.after}
                  </div>
                  {result.finished && (
                      <span className="font-medium bg-green-500/30 w-fit py-1 px-3 rounded-full text-black mb-3 text-sm flex items-center gap-2">
                        <HugeiconsIcon icon={CheckmarkCircle03Icon} size={16} strokeWidth={3} className="text-green-700"/>
                        bilangan prima
                      </span>
                    )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {renderObjectCopies(result.after, imageUrl)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
