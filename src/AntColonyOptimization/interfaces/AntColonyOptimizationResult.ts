import AntTripResult from "../modules/AntTripResult";
import Vector from "./Vector";

export default interface AntColonyOptimizationResult<V extends Vector> {
  /**
   * 當前回合
   */
  roundCount: number;

  /**
   * 歷史回合螞蟻旅行結果
   * [round][AntTripResult]
   */
  //   history: AntTripResult<V>[][];

  /**
   * 本回合所有螞蟻旅行結果
   */
  antsTripResultList: AntTripResult<V>[];

  /**
   * 本回合最佳 旅行結果
   */
  roundBestAntTripResult: AntTripResult<V>;

  /**
   * 歷史最佳 旅行結果
   */
  bestAntTripResult: AntTripResult<V>;
}
