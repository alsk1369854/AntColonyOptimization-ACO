import Vector3D from "./Vector3D";
import AntColonyOptimizationResult from "./AntColonyOptimizationResult";

export default interface AntColonyOptimizationOptionState {
  /**
   * 螞蟻數量
   */
  antAmount: number;

  /**
   * 最大迭代回合
   */
  maximumRounds: number;

  /**
   * [回調] 回合結束時
   * @param result 當前回合的計算結果
   * @returns 是否中斷計算
   */
  onRoundEnds(
    result: AntColonyOptimizationResult<Vector3D>,
    roundResultHistory: AntColonyOptimizationResult<Vector3D>[]
  ): boolean | void;

  /**
   * 初始費洛蒙
   */
  initialPheromone: number;

  /**
   * 費洛蒙增量
   * - 每隻螞蟻經過路徑的費洛蒙增量
   */
  pheromoneIncrement: number;

  /**
   * 費洛蒙衰退率 0~1
   * - 每次迭代的費洛蒙衰退率
   */
  pheromoneWeakeningRate: number;

  /**
   * 費洛蒙權重
   * - 費洛蒙矩陣的採納權重
   */
  pheromoneWeight: number;

  /**
   * 距離權重 (建議: 距離權重 > 費洛蒙權重)
   * - 距離矩陣的採納權重
   */
  distanceWeight: number;
}
