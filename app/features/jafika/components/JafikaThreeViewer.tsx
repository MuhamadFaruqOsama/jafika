"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Bounds, Environment, useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";

type JafikaThreeViewerProps = {
  onReady?: () => void;
  animationTriggerTicks?: Partial<Record<AssistantAnimationKey, number>>;
};

type AssistantAnimationKey = "waving" | "clap" | "headShake" | "dance1";

type StellaModelProps = {
  onReady?: () => void;
  animationTriggerTicks?: Partial<Record<AssistantAnimationKey, number>>;
};

function normalizeClipName(name: string): string {
  return name.toLowerCase().replace(/[\s_-]/g, "");
}

function findClipByAliases(names: string[], aliases: string[]): string | undefined {
  if (names.length === 0) return undefined;

  const normalizedAliases = aliases.map((alias) => normalizeClipName(alias));
  return names.find((name) => {
    const normalizedName = normalizeClipName(name);
    return normalizedAliases.some((alias) => normalizedName.includes(alias));
  });
}

function StellaModel({ onReady, animationTriggerTicks }: StellaModelProps) {
  const gltf = useGLTF("/3D/3d-assistant-2.glb");
  const { actions, names, mixer } = useAnimations(gltf.animations, gltf.scene);
  const activeActionRef = useRef<THREE.AnimationAction | null>(null);
  const cleanupFinishedHandlerRef = useRef<(() => void) | null>(null);

  const stayClipName = useMemo(
    () => findClipByAliases(names, ["stay"]) ?? names[0],
    [names],
  );
  const wavingClipName = useMemo(
    () => findClipByAliases(names, ["waving", "wave"]),
    [names],
  );
  const clapClipName = useMemo(
    () => findClipByAliases(names, ["clap"]),
    [names],
  );
  const headShakeClipName = useMemo(
    () => findClipByAliases(names, ["headshake", "head_shake", "shake"]),
    [names],
  );
  const danceClipName = useMemo(
    () => findClipByAliases(names, ["dance1", "dance 1", "dance"]),
    [names],
  );

  const playStay = useCallback(() => {
    if (!stayClipName) return;

    const stayAction = actions[stayClipName];
    if (!stayAction) {
      console.warn("[3D] stay action tidak tersedia untuk clip:", stayClipName);
      return;
    }

    stayAction
      .reset()
      .setLoop(THREE.LoopRepeat, Infinity)
      .fadeIn(0.2)
      .setEffectiveTimeScale(1)
      .setEffectiveWeight(1)
      .play();
    activeActionRef.current = stayAction;
  }, [actions, stayClipName]);

  const playOneShotThenStay = useCallback(
    (clipName: string | undefined, triggerTick: number, debugName: string) => {
      if (triggerTick <= 0 || !clipName || !stayClipName) return;

      const transientAction = actions[clipName];
      const stayAction = actions[stayClipName];
      if (!transientAction || !stayAction) {
        console.warn("[3D] action tidak siap:", {
          debugName,
          clipName,
          stayClipName,
          hasTransientAction: Boolean(transientAction),
          hasStayAction: Boolean(stayAction),
        });
        return;
      }

      cleanupFinishedHandlerRef.current?.();

      const handleFinished = (event: { type: string; action: THREE.AnimationAction }) => {
        if (event.action !== transientAction) return;

        mixer.removeEventListener("finished", handleFinished);
        cleanupFinishedHandlerRef.current = null;
        transientAction.fadeOut(0.2);
        playStay();
        console.log(`[3D] ${debugName} selesai, kembali ke stay:`, stayClipName);
      };

      cleanupFinishedHandlerRef.current = () => {
        mixer.removeEventListener("finished", handleFinished);
      };
      mixer.addEventListener("finished", handleFinished);

      if (activeActionRef.current && activeActionRef.current !== transientAction) {
        activeActionRef.current.fadeOut(0.2);
      }

      transientAction
        .reset()
        .setLoop(THREE.LoopOnce, 1)
        .fadeIn(0.2)
        .setEffectiveTimeScale(1)
        .setEffectiveWeight(1)
        .play();
      activeActionRef.current = transientAction;
      console.log(`[3D] play ${debugName} animation:`, clipName, { triggerTick });
    },
    [actions, mixer, playStay, stayClipName],
  );

  useEffect(() => {
    console.log("[3D] model loaded:", {
      animationCount: gltf.animations.length,
      sceneChildren: gltf.scene.children.length,
    });
  }, [gltf.animations.length, gltf.scene.children.length]);

  useEffect(() => {
    onReady?.();
  }, [onReady]);

  useEffect(() => {
    console.log("GLB animation names:", names);
  }, [names]);

  useEffect(() => {
    if (!stayClipName) {
      console.warn("[3D] stay clip tidak ditemukan. Names:", names);
      return;
    }

    mixer.stopAllAction();
    playStay();

    const stayAction = actions[stayClipName];
    console.log("[3D] play default animation:", stayClipName, {
      running: stayAction?.isRunning(),
      weight: stayAction?.getEffectiveWeight(),
      timeScale: stayAction?.getEffectiveTimeScale(),
    });

    return () => {
      cleanupFinishedHandlerRef.current?.();
      cleanupFinishedHandlerRef.current = null;
      stayAction?.fadeOut(0.2);
    };
  }, [actions, mixer, names, playStay, stayClipName]);

  useEffect(() => {
    playOneShotThenStay(wavingClipName, animationTriggerTicks?.waving ?? 0, "waving");
  }, [animationTriggerTicks?.waving, playOneShotThenStay, wavingClipName]);

  useEffect(() => {
    playOneShotThenStay(clapClipName, animationTriggerTicks?.clap ?? 0, "clap");
  }, [animationTriggerTicks?.clap, clapClipName, playOneShotThenStay]);

  useEffect(() => {
    playOneShotThenStay(
      headShakeClipName,
      animationTriggerTicks?.headShake ?? 0,
      "head shake",
    );
  }, [animationTriggerTicks?.headShake, headShakeClipName, playOneShotThenStay]);

  useEffect(() => {
    playOneShotThenStay(danceClipName, animationTriggerTicks?.dance1 ?? 0, "dance 1");
  }, [animationTriggerTicks?.dance1, danceClipName, playOneShotThenStay]);

  return <primitive object={gltf.scene} />;
}

export function JafikaThreeViewer({ onReady, animationTriggerTicks }: JafikaThreeViewerProps) {
  return (
    <div className="h-full w-full">
      <Canvas 
        camera={{ 
            position: [0, 0, 5], 
            fov: 40, 
            near: 0.01, 
            far: 200 
        }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[2, 3, 2]} intensity={1.4} />
        <Suspense fallback={null}>
          <Bounds fit observe margin={1.15}>
            <StellaModel onReady={onReady} animationTriggerTicks={animationTriggerTicks} />
          </Bounds>
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/3D/3d-assistant-2.glb");
