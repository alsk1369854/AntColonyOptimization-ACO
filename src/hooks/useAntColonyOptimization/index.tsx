import React, { useState, useEffect } from "react";
import {
  AntColonyOptimization,
  AntColonyOptimizationOption,
  AntColonyOptimizationResult,
  AntColonyOptimizationRoundResult,
  Vector,
  Vector3D,
} from "@alsk1369854/ant-colony-optimization";

// type UseAntColonyOptimization = {
//   result: AntColonyOptimizationResult<Vector3D> | undefined;
//   isRuning: boolean;
//   calculate: (
//     vectorList: Vector[],
//     option?: AntColonyOptimizationOption
//   ) => void;
// };

export function useAntColonyOptimization(): {
  roundResult: AntColonyOptimizationRoundResult<Vector3D> | undefined;
  isRuning: boolean;
  calculate: (
    vectorList: Vector[],
    option?: AntColonyOptimizationOption
  ) => void;
} {
  const [roundResult, setRoundResult] =
    useState<AntColonyOptimizationRoundResult<Vector3D>>();
  const [isRuning, setIsRuning] = useState<boolean>(false);

  function calculate(
    vectorList: Vector[],
    option?: AntColonyOptimizationOption
  ): void {
    if (isRuning) return;
    if (!option) option = {};

    setIsRuning(true);

    option = {
      ...option,
      onRoundEnds: (result) => {
        if (!result) return;
        setRoundResult(result);
      },
    };

    const aco = new AntColonyOptimization<Vector>(vectorList, option);
    aco.getResult().then(() => {
      setIsRuning(false);
    });
  }

  return { roundResult, isRuning, calculate };
}
