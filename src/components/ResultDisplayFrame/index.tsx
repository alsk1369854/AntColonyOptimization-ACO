import React, { Suspense } from "react";
import Example from "../Example";
import {
  AntColonyOptimizationResult,
  Vector3D,
} from "@alsk1369854/ant-colony-optimization";

export interface IResultDisplayFrameProps {
  result: AntColonyOptimizationResult<Vector3D> | undefined;
}

export default function ResultDisplayFrame({
  result,
}: IResultDisplayFrameProps) {
  return <Example result={result}></Example>;
}
