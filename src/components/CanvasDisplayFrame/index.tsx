import React from "react";
import { UseAntColonyOptimizationReturn } from "../../hooks/useAntColonyOptimization";
import {
  OrbitControls,
  PerspectiveCamera,
  Sphere,
  Line,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

type Props = {
  roundResult: UseAntColonyOptimizationReturn["roundResult"];
};

export default function CanvasDisplayFrame({ roundResult }: Props) {
  const pointColor: string = "#354aa6";
  const lineColor: string = "#778ffc";

  let pointPositionList: [x: number, y: number, z: number][] = [];
  if (roundResult) {
    pointPositionList = roundResult.historyBestTripResult.tripVectorList.map(
      ({ x, y, z }) => [x, y, z]
    );
  }

  return (
    <div style={{ width: "100%" }}>
      <Canvas>
        {/* 攝像機 */}
        <PerspectiveCamera
          makeDefault
          position={[0, 0, 120]}
        ></PerspectiveCamera>

        {/* 場景拖移 */}
        <OrbitControls
          target={[0, 0.35, 0]}
          maxPolarAngle={1.45}
          position={[250, 150, 30]}
        ></OrbitControls>

        {/* 點 */}
        {pointPositionList.map((position, index) => (
          <Sphere
            key={index}
            position={position}
            scale={0.8}
            material-color={pointColor}
          ></Sphere>
        ))}

        {/* 線 */}
        <Line points={pointPositionList} color={lineColor} lineWidth={5} />
      </Canvas>
    </div>
  );
}
