import React, { Suspense } from "react";
import Example from "../Example";
import {
  AntColonyOptimizationResult,
  Vector3D,
} from "ant-colony-optimization-algorithm";
import { UseAntColonyOptimizationReturn } from "../../hooks/useAntColonyOptimization";
import { Progress } from "antd";

export interface IResultDisplayFrameProps {
  roundResult: UseAntColonyOptimizationReturn["roundResult"];
}

export default function ResultDisplayFrame({
  roundResult,
}: IResultDisplayFrameProps) {
  return (
    <div style={{ width: "100%" }}>
      <Example roundResult={roundResult}></Example>
    </div>
  );
}
