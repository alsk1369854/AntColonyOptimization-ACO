import React, { useState } from "react";
import {
  AntColonyOptimization,
  AntColonyOptimizationOption,
  AntColonyOptimizationRoundResult,
  Vector,
  Vector3D,
} from "ant-colony-optimization-algorithm";

export interface UseAntColonyOptimizationReturn {
  roundResult: AntColonyOptimizationRoundResult<Vector3D> | undefined;
  isRuning: boolean;
  percent: number;
  calculate: (
    vectorList: Vector[],
    option?: AntColonyOptimizationOption
  ) => void;
}

export function useAntColonyOptimization(): UseAntColonyOptimizationReturn {
  const [roundResult, setRoundResult] =
    useState<AntColonyOptimizationRoundResult<Vector3D>>();
  const [isRuning, setIsRuning] = useState<boolean>(false);
  const [percent, setPercent] = useState<number>(0);

  function calculate(
    vectorList: Vector[],
    option?: AntColonyOptimizationOption
  ): void {
    if (isRuning) return;
    if (!option) option = {};

    setIsRuning(true);

    const maximumRounds: number =
      option?.maximumRounds ??
      AntColonyOptimization.DEFAULT_OPTION_STATE.maximumRounds;
    option = {
      ...option,
      onRoundEnds: (result) => {
        setPercent(
          Math.ceil((result.lastRound.roundCount / maximumRounds) * 100)
        );
        setRoundResult(result.lastRound);
      },
    };

    const aco = new AntColonyOptimization<Vector>(vectorList, option);
    aco.getResult().then(() => {
      setIsRuning(false);
    });
  }

  return { roundResult, percent, isRuning, calculate };
}
