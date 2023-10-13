import {
  AntColonyOptimization,
  AntColonyOptimizationOption,
  AntColonyOptimizationResult,
  Vector3D,
} from "@alsk1369854/ant-colony-optimization";
import React, { useState } from "react";

export default function AntColonyOptimizationHook(): [
  AntColonyOptimizationResult<Vector3D> | undefined,
  boolean,
  (vectorAmount?: number, maximumRounds?: number) => void
] {
  const [result, setResult] = useState<AntColonyOptimizationResult<Vector3D>>();
  const [isRuning, setIsRouning] = useState<boolean>(false);

  function getRandomVector(max: number): Vector3D {
    return {
      x: Math.floor(Math.random() * max),
      y: Math.floor(Math.random() * max),
      z: Math.floor(Math.random() * max),
    };
  }

  function calculate(vectorAmount: number = 10, maximumRounds: number = 50) {
    if (isRuning) return;

    setIsRouning(true);
    let vectorList: Vector3D[] = [];
    for (let i = 0; i < vectorAmount; i++) {
      vectorList.push(getRandomVector(50));
    }
    const option: AntColonyOptimizationOption = {
      maximumRounds,
      onRoundEnds: (result) => {
        const temp = result as AntColonyOptimizationResult<Vector3D>;
        setResult(temp);
      },
    };

    new Promise((resolve) => {
      const aco = new AntColonyOptimization<Vector3D>(vectorList, option);
      aco.getResult().then(() => {
        setIsRouning(false);
      });
      resolve(undefined);
    });
  }

  return [result, isRuning, calculate];
}
