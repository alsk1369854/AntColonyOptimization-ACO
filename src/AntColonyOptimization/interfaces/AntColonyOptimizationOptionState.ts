export default interface AntColonyOptimizationOptionState {
  /**
   * 螞蟻數量
   */
  antAmount: number;

  /**
   * 最大迭代回合
   */
  maximumIterations: number;

  /**
   * 初始費洛蒙
   */
  initialPheromone: number;

  /**
   * 費洛蒙增量
   * - 每隻螞蟻經過路徑的基本費洛蒙增量
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
