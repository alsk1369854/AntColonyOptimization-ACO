import React, { useState, useEffect } from "react";
import {
  AntColonyOptimization,
  AntColonyOptimizationOption,
  AntColonyOptimizationResult,
  Vector3D,
} from "@alsk1369854/ant-colony-optimization";

export default function AntColonyOptimizationHook(): [
  AntColonyOptimizationResult<Vector3D> | undefined,
  boolean,
  number,
  (vectorAmount?: number, maximumRounds?: number) => void
] {
  const [result, setResult] = useState<AntColonyOptimizationResult<Vector3D>>();
  const [isRuning, setIsRouning] = useState<boolean>(false);
  const [roundCount, setRoundCount] = useState<number>(0);

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
      onRoundEnds: (result, history) => {
        setRoundCount(result.roundCount);
        setResult(result);
      },
    };

    const aco = new AntColonyOptimization<Vector3D>(vectorList, option);
    aco.getResult().then(() => {
      setIsRouning(false);
    });
  }

  useEffect(() => {
    // Some initialization logic here
    calculate();
  }, []);

  return [result, isRuning, roundCount, calculate];
}
