import React, { useState } from "react";
import {
  Line,
  OrbitControls,
  PerspectiveCamera,
  Sphere,
} from "@react-three/drei";
import AntColonyOptimizationHook from "../../hooks/AntColonyOptimizationHook";
import { Canvas } from "@react-three/fiber";

// const

export default function Example() {
  const pointColor: string = "#354aa6";
  const lineColor: string = "#778ffc";

  const [acoResult, acoIsRuning, acoRoundCount, acoCalculate] =
    AntColonyOptimizationHook();
  const [vectorAmount, setVectorAmount] = useState<number>(10);
  const [maximumRounds, setMaximumRounds] = useState<number>(50);

  return (
    <>
      <div style={{ display: "flex", padding: 10 }}>
        <div style={{ display: "flex", alignItems: "center", padding: 10 }}>
          <span>隨機向量個數：</span>
          <input
            type="number"
            value={vectorAmount}
            onChange={(e) => {
              setVectorAmount(+e.target.value);
            }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", padding: 10 }}>
          <span>迭代回合：</span>
          <input
            type="number"
            value={maximumRounds}
            onChange={(e) => {
              setMaximumRounds(+e.target.value);
            }}
          />
        </div>

        <div style={{ padding: 10 }}>
          <div style={{ color: acoIsRuning ? "red" : "green" }}>
            {acoIsRuning ? "計算中" : "計算完成"}
          </div>
          <div>
            {acoRoundCount}/{maximumRounds}
          </div>
        </div>
        <button onClick={() => acoCalculate(vectorAmount, maximumRounds)}>
          開始計算
        </button>
      </div>
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

        {acoResult ? (
          acoResult.historyBestTripResult.tripVectorList.map(
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

        {acoResult ? (
          <Line
            points={acoResult.historyBestTripResult.tripVectorList.map(
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