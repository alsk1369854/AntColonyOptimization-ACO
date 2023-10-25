import React from "react";
import SettingFormFrame from "../../components/SideBarFrame/components/SettingFormFrame";
import { Flex } from "antd";
import { useAntColonyOptimization } from "../../hooks/useAntColonyOptimization";
import CanvasDisplayFrame from "../../components/CanvasDisplayFrame";
import SideBarFrame from "../../components/SideBarFrame";

export default function MainPage() {
  const { roundResult, percent, calculate } = useAntColonyOptimization();

  return (
    <Flex style={{ height: "100vh", width: "100vw" }}>
      <SideBarFrame percent={percent} calculate={calculate}></SideBarFrame>

      <CanvasDisplayFrame roundResult={roundResult}></CanvasDisplayFrame>
    </Flex>
  );
}
