# AntColonyOptimization-ACO

[![npm version](https://img.shields.io/npm/v/@alsk1369854/ant-colony-optimization)](https://www.npmjs.com/package/@alsk1369854/ant-colony-optimization) [![install size](https://img.shields.io/badge/dynamic/json?url=https://packagephobia.com/v2/api.json?p=@alsk1369854/ant-colony-optimization&query=$.install.pretty&label=install%20size&style=flat-square)](https://packagephobia.now.sh/result?p=@alsk1369854/ant-colony-optimization) ![check-code-coverage](https://img.shields.io/badge/code--coverage-97.76%25-brightgreen) ![npm type definitions](https://img.shields.io/npm/types/@alsk1369854/ant-colony-optimization) ![NPM](https://img.shields.io/npm/l/@alsk1369854/ant-colony-optimization)

Ant colony optimization algorithm

## Installing

### Package manager

Using npm:

```bash
npm install @alsk1369854/ant-colony-optimization
```

Using yarn:

```bash
yarn add @alsk1369854/ant-colony-optimization
```

## Example

- <a target='_blank' href='https://alsk1369854.github.io/AntColonyOptimization-ACO'>DEMO</a>

### Basic example

#### index.ts

```ts
import {
  AntColonyOptimization,
  Vector3D,
} from "@alsk1369854/ant-colony-optimization";

function getRandomVectorList(
  length: number,
  maxValue: number = 10
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

// 向量序列
const vectorList: Vector3D[] = getRandomVectorList(10);

// 蟻群優化算法
const aco: AntColonyOptimization<Vector3D> = new AntColonyOptimization(
  vectorList
);

// 獲得運算結果
aco.getResult().then((result) => console.log(result));
```

## AntColonyOptimization API

### Constructor

| Constructor                                                             | Description                                  |
| ----------------------------------------------------------------------- | -------------------------------------------- |
| constructor(vectorList: Vector[], option?: AntColonyOptimizationOption) | vectorList: 座標點向量序列, option: 配置參數 |

### Methods

| Methods                                                   | Description            |
| --------------------------------------------------------- | ---------------------- |
| async getResult():Promise<AntColonyOptimizationResult<V>> | 獲得螞蟻演算法計算結果 |

## AntColonyOptimizationOption API

### Setting options

| Values                                                               | Description                                           |
| -------------------------------------------------------------------- | ----------------------------------------------------- |
| antAmount: number                                                    | 螞蟻數量                                              |
| maximumRounds: number                                                | 最大迭代回合                                          |
| maximumRounds: number                                                | 最大迭代回合                                          |
| initialPheromone: number                                             | 初始費洛蒙                                            |
| pheromoneIncrement: number                                           | 每隻螞蟻經過路徑費洛蒙增量 (增量 / 螞蟻行走距離)      |
| pheromoneWeakeningRate: number                                       | 每次迭代的費洛蒙衰退率 0 ~ 1 (上一次 \* (1 - 衰退率)) |
| pheromoneWeight: number                                              | 費洛蒙權重                                            |
| distanceWeight: number                                               | 距離權重 (建議: 距離權重 > 費洛蒙權重)                |
| onRoundEnds: (result: AntColonyOptimizationResult<Vector3D>) => void | [回調] 回每合結束時                                   |

## License

[MIT](LICENSE)
