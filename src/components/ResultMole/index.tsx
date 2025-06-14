import { useEffect, useRef } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import { Mesh, SkinnedMesh } from "three";
import * as THREE from "three";

const ResultMole = ({}) => {
  const { scene, animations } = useGLTF("/model/mole.glb"); // モデルを読み込む
  const { actions } = useAnimations(animations, scene);
  const ref = useRef<THREE.Object3D>(null); // 回転を適用するための参照
  const wrapperRef = useRef<THREE.Group>(null);

  scene.traverse((child) => {
    if (child instanceof Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
    if (child instanceof SkinnedMesh) {
      child.skeleton.update(); // Ensure skeleton updates
    }
  });

  // useEffect(() => {
  //   if (ref.current) {
  //     ref.current.rotation.y = -Math.PI / 2;
  //   }
  // }, []);

  useEffect(() => {
    if (actions) {
      const action = actions[Object.keys(actions)[0]]; // Use the first animation
      if (action) {
        action.clampWhenFinished = true;
        action.loop = THREE.LoopOnce;
        action.play();
      }
    }
  }, [actions]);

  return (
    <>
      <group ref={wrapperRef} scale={0.3} position={[2.5, 0.3, 2.5]}>
        <primitive ref={ref} object={scene} />
      </group>
    </>
  );
};

export default ResultMole;
