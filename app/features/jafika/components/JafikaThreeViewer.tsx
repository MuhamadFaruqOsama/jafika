"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Bounds, Environment, useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";

type JafikaThreeViewerProps = {
  onReady?: () => void;
  waveTriggerTick?: number;
};

type StellaModelProps = {
  onReady?: () => void;
  waveTriggerTick?: number;
};

function StellaModel({ onReady, waveTriggerTick = 0 }: StellaModelProps) {
  const gltf = useGLTF("/3D/coba-3.glb");
  const { actions, names, mixer } = useAnimations(gltf.animations, gltf.scene);
  const activeActionRef = useRef<THREE.AnimationAction | null>(null);

  const stayClipName = useMemo(
    () => names.find((name) => name.toLowerCase().includes("stay")) ?? names[0],
    [names],
  );
  const wavingClipName = useMemo(
    () => names.find((name) => name.toLowerCase().includes("waving")),
    [names],
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

    const stayAction = actions[stayClipName];
    if (!stayAction) {
      console.warn("[3D] stay action tidak tersedia untuk clip:", stayClipName);
      return;
    }

    mixer.stopAllAction();
    stayAction.setLoop(THREE.LoopRepeat, Infinity);
    stayAction
      .reset()
      .fadeIn(0.2)
      .setEffectiveTimeScale(1)
      .setEffectiveWeight(1)
      .play();
    console.log("[3D] play default animation:", stayClipName, {
      running: stayAction.isRunning(),
      weight: stayAction.getEffectiveWeight(),
      timeScale: stayAction.getEffectiveTimeScale(),
    });
    activeActionRef.current = stayAction;

    return () => {
      stayAction.fadeOut(0.2);
    };
  }, [actions, mixer, names, stayClipName]);

  useEffect(() => {
    if (waveTriggerTick <= 0 || !wavingClipName || !stayClipName) return;

    const wavingAction = actions[wavingClipName];
    const stayAction = actions[stayClipName];
    if (!wavingAction || !stayAction) {
      console.warn("[3D] waving/stay action tidak siap:", {
        wavingClipName,
        stayClipName,
        hasWavingAction: Boolean(wavingAction),
        hasStayAction: Boolean(stayAction),
      });
      return;
    }

    const handleFinished = (event: { type: string; action: THREE.AnimationAction }) => {
      if (event.action !== wavingAction) return;

      mixer.removeEventListener("finished", handleFinished);
      console.log("[3D] waving selesai, kembali ke stay:", stayClipName);
      wavingAction.fadeOut(0.2);
      stayAction
        .reset()
        .setLoop(THREE.LoopRepeat, Infinity)
        .fadeIn(0.2)
        .setEffectiveTimeScale(1)
        .setEffectiveWeight(1)
        .play();
      console.log("[3D] play stay (after waving):", stayClipName, {
        running: stayAction.isRunning(),
      });
      activeActionRef.current = stayAction;
    };

    mixer.addEventListener("finished", handleFinished);

    if (activeActionRef.current && activeActionRef.current !== wavingAction) {
      activeActionRef.current.fadeOut(0.2);
    }

    wavingAction.setLoop(THREE.LoopOnce, 1);
    wavingAction
      .reset()
      .fadeIn(0.2)
      .setEffectiveTimeScale(1)
      .setEffectiveWeight(1)
      .play();
    console.log("[3D] play waving animation:", wavingClipName, {
      triggerTick: waveTriggerTick,
      running: wavingAction.isRunning(),
    });
    activeActionRef.current = wavingAction;

    return () => mixer.removeEventListener("finished", handleFinished);
  }, [actions, mixer, stayClipName, wavingClipName, waveTriggerTick]);

  return <primitive object={gltf.scene} />;
}

export function JafikaThreeViewer({ onReady, waveTriggerTick }: JafikaThreeViewerProps) {
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
            <StellaModel onReady={onReady} waveTriggerTick={waveTriggerTick} />
          </Bounds>
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/3D/coba-3.glb");
