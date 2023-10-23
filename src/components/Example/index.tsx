import React, { useState } from "react";
import {
  Line,
  OrbitControls,
  PerspectiveCamera,
  Sphere,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  AntColonyOptimizationResult,
  Vector3D,
} from "@alsk1369854/ant-colony-optimization";

export interface IResultDisplayFrameProps {
  result: AntColonyOptimizationResult<Vector3D> | undefined;
}

// const

export default function Example({ result }: IResultDisplayFrameProps) {
  const pointColor: string = "#354aa6";
  const lineColor: string = "#778ffc";

  return (
    <>
      <Canvas style={{ height: "100vh", width: "100vw" }}>
        <OrbitControls
          target={[0, 0.35, 0]}
          maxPolarAngle={1.45}
          position={[250, 150, 30]}
        ></OrbitControls>
        <PerspectiveCamera
          makeDefault
          position={[0, 0, 120]}
        ></PerspectiveCamera>

        {result ? (
          result.historyBestTripResult.tripVectorList.map(
            ({ x, y, z }, index) => {
              return (
                <Sphere
                  key={index}
                  position={[x, y, z]}
                  scale={0.8}
                  material-color={pointColor}
                ></Sphere>
              );
            }
          )
        ) : (
          <></>
        )}

        {result ? (
          <Line
            points={result.historyBestTripResult.tripVectorList.map(
              ({ x, y, z }) => [x, y, z]
            )}
            color={lineColor}
            lineWidth={5}
          />
        ) : (
          <></>
        )}
      </Canvas>
    </>
  );
}
