import type { FactorPower } from "@/app/features/jafika/types/fpb";

type ExplanationCardProps = {
  visible: boolean;
  numbers: number[];
  resultValue: number;
  faktorList: FactorPower[];
  operationLabel: "FPB" | "KPK";
};

export function ExplanationCard({
  visible,
  numbers,
  resultValue,
  faktorList,
  operationLabel,
}: ExplanationCardProps) {
  if (!visible) return null;

  return (
    <div id="penjelasan-fpb">
      <div className="mb-10 mt-3 bg-pink-100 px-3 pb-5 pt-3 rounded-lg dark:bg-pink-500/30">
        <div className="mb-3 rounded-md border border-yellow-500 bg-yellow-100 dark:bg-yellow-300/20 dark:text-white py-2 px-4">
          Penjelasan
        </div>
        <div className="dark:text-white">
          {operationLabel} dari{" "}
          {numbers.map((number, index) => (
            <b key={index}>
              {number}
              {index < numbers.length - 1 ? ", " : ""}
            </b>
          ))}{" "}
          yang benar adalah:
          <div className="mt-2 rounded-lg border-2 border-green-500 bg-white p-2 text-center text-lg font-semibold dark:text-black">
            {faktorList.map((factor, index) => (
              <span key={`${factor.prime}-${factor.exp}`}>
                {factor.prime}
                {factor.exp > 1 && <sup>{factor.exp}</sup>}
                {index < faktorList.length - 1 ? " x " : ""}
              </span>
            ))}{" "}
            = {resultValue}
          </div>
        </div>
      </div>
    </div>
  );
}
