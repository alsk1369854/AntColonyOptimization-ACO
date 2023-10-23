import React, { useEffect } from "react";
import { Button, Flex, Form, InputNumber, Progress, Space } from "antd";
import {
  AntColonyOptimization,
  AntColonyOptimizationOption,
  Vector3D,
} from "ant-colony-optimization-algorithm";
import { UseAntColonyOptimizationReturn } from "../../hooks/useAntColonyOptimization";

interface ISettingFormValue extends AntColonyOptimizationOption {
  randomVectorAmount: number;
}

export interface ISettingFormFrameProps {
  percent: UseAntColonyOptimizationReturn["percent"];
  calculate: UseAntColonyOptimizationReturn["calculate"];
}

export default function SettingFormFrame({
  percent,
  calculate,
}: ISettingFormFrameProps) {
  const initialValues: ISettingFormValue = {
    ...AntColonyOptimization.DEFAULT_OPTION_STATE,
    randomVectorAmount: 10,
  };

  useEffect(() => {
    onFinish(initialValues);
  }, []);

  function onFinish(values: ISettingFormValue): void {
    const vecterList: Vector3D[] = getRandomVectorList(
      values.randomVectorAmount
    );
    calculate(vecterList, values);
  }

  function getRandomVectorList(
    length: number,
    maxValue: number = 50
  ): Vector3D[] {
    let result: Vector3D[] = [];
    for (let i = 0; i < length; i++) {
      result.push({
        x: Math.floor(Math.random() * maxValue),
        y: Math.floor(Math.random() * maxValue),
        z: Math.floor(Math.random() * maxValue),
      });
    }
    return result;
  }

  return (
    <Form
      name="參數設定表單"
      layout="vertical"
      onFinish={onFinish}
      initialValues={initialValues}
      style={{
        padding: 10,
        width: 430,
        boxShadow: "2px 2px 2px 1px rgba(0, 0, 0, 0.2)",
      }}
    >
      <h1>參數設定表單</h1>

      <Space>
        <Form.Item<ISettingFormValue>
          label="螞蟻數量"
          name="antAmount"
          rules={[
            { type: "number", required: true, message: "請輸入螞蟻數量" },
          ]}
        >
          <InputNumber style={{ width: "100%" }} min={1} />
        </Form.Item>

        <Form.Item<ISettingFormValue>
          label="迭代回合數"
          name="maximumRounds"
          rules={[{ required: true, message: "請輸入迭代回合數" }]}
        >
          <InputNumber style={{ width: "100%" }} min={1} />
        </Form.Item>
      </Space>

      <Space>
        <Form.Item<ISettingFormValue>
          label="費洛蒙增量"
          name="pheromoneIncrement"
          rules={[{ required: true, message: "請輸入費洛蒙增量" }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item<ISettingFormValue>
          label="費洛蒙衰退率"
          name="pheromoneWeakeningRate"
          rules={[{ required: true, message: "請輸入費洛蒙衰退率" }]}
        >
          <InputNumber style={{ width: "100%" }} min={0} max={1} step={0.1} />
        </Form.Item>
      </Space>

      <Space>
        <Form.Item<ISettingFormValue>
          label="費洛蒙權重"
          name="pheromoneWeight"
          rules={[{ required: true, message: "請輸入費洛蒙權重" }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item<ISettingFormValue>
          label="距離權重"
          name="distanceWeight"
          rules={[{ required: true, message: "請輸入距離權重" }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
      </Space>

      <Form.Item<ISettingFormValue>
        label="初始費洛蒙"
        name="initialPheromone"
        rules={[{ required: true, message: "請輸入初始費洛蒙" }]}
      >
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item<ISettingFormValue>
        label="隨機向量"
        name="randomVectorAmount"
        rules={[{ required: true, message: "請輸入隨機向量" }]}
      >
        <InputNumber style={{ width: "100%" }} min={1} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
          開始計算
        </Button>
      </Form.Item>

      <Flex justify="center" align="center">
        <Progress
          type="dashboard"
          percent={percent}
          size={300}
          strokeColor={{ "0%": "#4676fb", "100%": "#7fc336" }}
        />
      </Flex>
    </Form>
  );
}
