import React from "react";
import ResultDisplayFrame from "../../components/ResultDisplayFrame";
import SettingFormFrame from "../../components/SettingFormFrame";
import { Col, Flex } from "antd";

export default function MainPage() {
  return (
    <Flex>
      <SettingFormFrame></SettingFormFrame>

      <ResultDisplayFrame></ResultDisplayFrame>
    </Flex>
  );
}
