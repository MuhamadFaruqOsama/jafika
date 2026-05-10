"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { ReactNode } from "react";

type ProgressBarProviderProps = {
  children: ReactNode;
};

export function ProgressBarProvider({ children }: ProgressBarProviderProps) {
  return (
    <>
      {children}
      <ProgressBar
        height="4px"
        color="#fffd00"
        options={{ showSpinner: false }}
        startPosition={0.2}
        stopDelay={220}
        shallowRouting
      />
    </>
  );
}
