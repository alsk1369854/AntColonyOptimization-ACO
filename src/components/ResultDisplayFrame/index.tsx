import React, { Suspense } from "react";
import Example from "../Example";
import {
  AntColonyOptimizationResult,
  Vector3D,
} from "@alsk1369854/ant-colony-optimization";
import { UseAntColonyOptimizationReturn } from "../../hooks/useAntColonyOptimization";

export interface IResultDisplayFrameProps {
  roundResult: UseAntColonyOptimizationReturn["roundResult"];
}

export default function ResultDisplayFrame({
  roundResult,
}: IResultDisplayFrameProps) {
  return <Example result={roundResult}></Example>;
}
