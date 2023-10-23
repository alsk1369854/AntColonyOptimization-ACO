import React from "react";
import ResultDisplayFrame from "../../components/ResultDisplayFrame";
import SettingFormFrame from "../../components/SettingFormFrame";
import { Col, Flex } from "antd";
import { useAntColonyOptimization } from "../../hooks/useAntColonyOptimization";

export default function MainPage() {
  const { result, calculate } = useAntColonyOptimization();

  return (
    <Flex>
      <SettingFormFrame calculate={calculate}></SettingFormFrame>

      <ResultDisplayFrame result={result}></ResultDisplayFrame>
    </Flex>
  );
}
