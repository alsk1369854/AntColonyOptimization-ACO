import React from "react";
import { Button, Checkbox, Form, Input, InputNumber } from "antd";
import {
  AntColonyOptimization,
  AntColonyOptimizationOption,
} from "@alsk1369854/ant-colony-optimization";

export default function SettingFormFrame() {
  const onFinish = (values: AntColonyOptimizationOption) => {
    console.log("Success:", values);
  };

  return (
    <Form
      name="設定表單"
      layout="vertical"
      style={{ padding: 10, width: 600, backgroundColor: "skyblue" }}
      onFinish={onFinish}
    >
      <Form.Item<AntColonyOptimizationOption>
        label="螞蟻數量"
        name="antAmount"
        rules={[{ required: true, message: "請輸入螞蟻數量" }]}
      >
        <InputNumber
          style={{ width: "100%" }}
          min={1}
          defaultValue={AntColonyOptimization}
        />
      </Form.Item>

      <Form.Item<AntColonyOptimizationOption>
        label="迭代回合數"
        name="maximumRounds"
        rules={[{ required: true, message: "請輸入迭代回合數" }]}
      >
        <InputNumber style={{ width: "100%" }} min={1} defaultValue={50} />
      </Form.Item>

      <Form.Item<AntColonyOptimizationOption>
        label="迭代回合數"
        name="maximumRounds"
        rules={[{ required: true, message: "請輸入迭代回合數" }]}
      >
        <InputNumber style={{ width: "100%" }} min={1} defaultValue={50} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
