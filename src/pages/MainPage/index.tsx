import React from "react";
import ResultDisplayFrame from "../../components/ResultDisplayFrame";
import SettingFormFrame from "../../components/SettingFormFrame";
import { Flex } from "antd";
import { useAntColonyOptimization } from "../../hooks/useAntColonyOptimization";

export default function MainPage() {
  const { roundResult, percent, calculate } = useAntColonyOptimization();

  return (
    <Flex style={{ height: "100vh", width: "100vw" }}>
      <SettingFormFrame
        calculate={calculate}
        percent={percent}
      ></SettingFormFrame>

      <ResultDisplayFrame roundResult={roundResult}></ResultDisplayFrame>
    </Flex>
  );
}
