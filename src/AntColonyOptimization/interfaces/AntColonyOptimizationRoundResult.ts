import TripResult from "../modules/TripResult";
import Vector from "./Vector";

export default interface AntColonyOptimizationRoundResult<V extends Vector> {
  /**
   * 當前回合
   */
  roundCount: number;

  /**
   * 本回合所有螞蟻旅行結果
   */
  tripResultList: TripResult<V>[];

  /**
   * 本回合最佳 旅行結果
   */
  roundBestTripResult: TripResult<V>;

  /**
   * 歷史最佳 旅行結果
   */
  historyBestTripResult: TripResult<V>;
}
