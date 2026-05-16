"use client";

import { useEffect, useRef, useState } from "react";
import { PinIcon, PinOffIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type NumberPreviewBarProps = {
  numbers: number[];
};

export function NumberPreviewBar({ numbers }: NumberPreviewBarProps) {
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const [isFloating, setIsFloating] = useState(false);
  const [barHeight, setBarHeight] = useState(0);
  const [isStickyEnabled, setIsStickyEnabled] = useState(true);
  const floatOffset = 56;

  useEffect(() => {
    const updateFloating = () => {
      if (!anchorRef.current) return;
      const top = anchorRef.current.getBoundingClientRect().top;
      if (!isStickyEnabled) {
        setIsFloating(false);
        return;
      }
      setIsFloating(top <= floatOffset);
    };

    const updateHeight = () => {
      if (!barRef.current) return;
      setBarHeight(barRef.current.getBoundingClientRect().height);
    };

    updateHeight();
    updateFloating();
    window.addEventListener("scroll", updateFloating, { passive: true });
    window.addEventListener("resize", updateHeight);
    return () => {
      window.removeEventListener("scroll", updateFloating);
      window.removeEventListener("resize", updateHeight);
    };
  }, [isStickyEnabled]);

  if (numbers.length === 0) return null;

  return (
    <div ref={anchorRef} className="relative w-full px-3 pt-14 md:px-6">
      {isFloating && barHeight > 0 && <div style={{ height: barHeight }} />}
      <div
        ref={barRef}
        className={`${
          isFloating
            ? "fixed left-1/2 top-5 z-30 w-[calc(100%-1.5rem)] -translate-x-1/2"
            : "relative"
        }`}
      >
        <div className="relative mx-auto w-fit">
          <button
            type="button"
            onClick={() => setIsStickyEnabled((prev) => !prev)}
            className="absolute -right-2 -top-3 z-50 rounded-full border border-gray-200 bg-white p-2 text-gray-700 shadow-md transition hover:bg-gray-50 cursor-pointer"
            aria-label={isStickyEnabled ? "Matikan sticky" : "Aktifkan sticky"}
            title={isStickyEnabled ? "Matikan sticky" : "Aktifkan sticky"}
          >
            <HugeiconsIcon icon={isStickyEnabled ? PinIcon : PinOffIcon} size={18} strokeWidth={2.5} />
          </button>
          <div className="rounded-4xl border border-gray-200 bg-white/95 p-4 shadow-md backdrop-blur dark:border-pink-400/40 dark:bg-black/85">
            <div className="flex flex-wrap items-center gap-4 md:text-sm">
              {numbers.map((number, index) => (
                <div
                  key={`${index}-${number}`}
                  className="rounded-2xl text-sm md:text-base text-center border border-gray-200 bg-white px-5 py-2 text-gray-600 dark:border-pink-400/60 dark:bg-pink-900/20 dark:text-pink-200"
                >
                  Bilangan ke-{index + 1}
                  <div className="font-extrabold text-2xl md:text-4xl text-pink-500 mt-2">
                    {number}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
