import React, { useEffect, useMemo } from "react";
import { useAnimations } from "@react-three/drei";
import { Mesh, SkinnedMesh } from "three";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

type ResultItemProps = {
  position: [number, number, number];
  displayFrameNumber?: number; // フレーム番号を受け取る
  scene: THREE.Group<THREE.Object3DEventMap>; // シーンを受け取る
  animations: THREE.AnimationClip[]; // アニメーションを受け取る
};

const ResultItem: React.FC<ResultItemProps> = ({
  position,
  displayFrameNumber = 0,
  scene,
  animations,
}) => {
  const memoizedScene = useMemo(() => scene.clone(), [scene]);
  const [currentDisplayFrameNumberState, setcurrentDisplayFrameNumberState] =
    React.useState(0);

  const memoizedAnimations = useMemo(
    () => animations.map((anim) => anim.clone()),
    [animations]
  );

  const { actions } = useAnimations(memoizedAnimations, memoizedScene);

  const colors = [
    "#FF080B",
    "#FFB300",
    "#FF6F00",
    "#D500F9",
    "#00B0FF",
    "#00C853",
    "#FF6D00",
    "#FFFFFF",
  ];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  memoizedScene.traverse((child) => {
    if (child instanceof Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      if (child.name.indexOf("flower") !== -1) {
        child.material = new THREE.MeshStandardMaterial({
          color: randomColor,
          roughness: 0.5,
          metalness: 0.1,
        });
      }
    }
    if (child instanceof SkinnedMesh) {
      child.skeleton.update(); // Ensure skeleton updates
    }
  });

  useEffect(() => {
    setcurrentDisplayFrameNumberState(displayFrameNumber);
    if (actions) {
      const action = actions[Object.keys(actions)[0]]; // Use the first animation
      if (action) {
        const frameRate = 24; // アニメーションのフレームレート
        const startFrame = currentDisplayFrameNumberState; // 再生開始フレーム
        const startTime = startFrame / frameRate; // フレームを秒に変換

        action.clampWhenFinished = true;
        action.loop = THREE.LoopOnce;
        action.time = startTime; // アニメーションの開始時間を設定
        action.play();
      }
    }
  }, [actions, displayFrameNumber]);

  useEffect(() => {
    memoizedScene.rotation.set(0, Math.PI / Math.floor(Math.random() * 18), 0);
  }, [memoizedScene]);

  useFrame(() => {
    if (actions) {
      const action = actions[Object.keys(actions)[0]];
      if (action && action.isRunning()) {
        const frameRate = 24;
        const stopFrame = displayFrameNumber;
        const stopTime = stopFrame / frameRate;

        if (action.time >= stopTime) {
          action.paused = true;
        }
      }
    }
  });

  return <primitive object={memoizedScene} scale={0.25} position={position} />;
};

// Custom comparison function to prevent unnecessary re-renders
const areEqual = (prevProps: ResultItemProps, nextProps: ResultItemProps) => {
  if (prevProps.position && nextProps.position) {
    return (
      prevProps.position?.[0] === nextProps.position?.[0] &&
      prevProps.position?.[1] === nextProps.position?.[1] &&
      prevProps.position?.[2] === nextProps.position?.[2] &&
      prevProps.displayFrameNumber === nextProps.displayFrameNumber
    );
  } else {
    return false;
  }
};

export default React.memo(ResultItem, areEqual);
