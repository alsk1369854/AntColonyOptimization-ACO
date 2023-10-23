import AntColonyOptimization from "./AntColonyOptimization";
import AntColonyOptimizationOption from "./interfaces/AntColonyOptimizationOption";
import Vector3D from "./interfaces/Vector3D";

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

describe("AntColonyOptimization test", () => {
  test("測試方法 getResult", () => {
    // 向量序列
    const vectorList: Vector3D[] = getRandomVectorList(10);

    // 蟻群優化算法
    const aco: AntColonyOptimization<Vector3D> = new AntColonyOptimization(
      vectorList
    );
    // 獲得運算結果
    aco.getResult().then((result) => {
      expect(typeof result).toBe("object");
    });
  });

  test("測試報錯 參數 vectorList ", () => {
    expect(() => {
      new AntColonyOptimization([]);
    }).toThrow(Error);
  });

  test("測試報錯 參數 option.maximumRounds", () => {
    // 向量序列
    const vectorList: Vector3D[] = getRandomVectorList(10);
    const option: AntColonyOptimizationOption = {
      maximumRounds: -1,
    };

    expect(() => {
      new AntColonyOptimization(vectorList, option);
    }).toThrow(Error);
  });

  test("測試報錯 參數 option.antAmount", () => {
    // 向量序列
    const vectorList: Vector3D[] = getRandomVectorList(10);
    const option: AntColonyOptimizationOption = {
      antAmount: -1,
    };

    expect(() => {
      new AntColonyOptimization(vectorList, option);
    }).toThrow(Error);
  });
});
