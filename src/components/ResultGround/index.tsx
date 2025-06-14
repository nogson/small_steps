import * as THREE from "three";
import { Suspense } from "react";
import { useTexture } from "@react-three/drei";

const ResultGround = ({}) => {
  const texture = useTexture({
    map: "texture/brown_mud_leaves_01_diff_1k.jpg",
    normalMap: "texture/brown_mud_leaves_01_nor_gl_1k.jpg",
    roughnessMap: "texture/brown_mud_leaves_01_rough_1k.jpg",
    aoMap: "texture/brown_mud_leaves_01_ao_1k.jpg",
    displacementMap: "texture/brown_mud_leaves_01_disp_1k.png",
  });

  const scale = 2;
  Object.values(texture).forEach((tex) => {
    if (tex) {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(scale, scale);
    }
  });
  return (
    <Suspense fallback={null}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20, 128, 128]} />
        <meshStandardMaterial {...texture} displacementScale={0.5} />
      </mesh>
    </Suspense>
  );
};

export default ResultGround;
