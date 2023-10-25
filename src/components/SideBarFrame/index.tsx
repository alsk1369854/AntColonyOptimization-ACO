import React from "react";
import SettingFormFrame from "./components/SettingFormFrame";
import { UseAntColonyOptimizationReturn } from "../../hooks/useAntColonyOptimization";
import { Flex, Progress } from "antd";

type Props = {
  percent: UseAntColonyOptimizationReturn["percent"];
  calculate: UseAntColonyOptimizationReturn["calculate"];
};

export default function SideBarFrame({ percent, calculate }: Props) {
  return (
    <div
      style={{
        padding: 10,
        width: 430,
        boxShadow: "2px 2px 2px 1px rgba(0, 0, 0, 0.2)",
        overflowY: "auto",
      }}
    >
      <SettingFormFrame calculate={calculate}></SettingFormFrame>

      <Flex justify="center" align="center">
        <Progress
          type="dashboard"
          percent={percent}
          strokeColor={{ "0%": "#4676fb", "100%": "#7fc336" }}
        />
      </Flex>
    </div>
  );
}
