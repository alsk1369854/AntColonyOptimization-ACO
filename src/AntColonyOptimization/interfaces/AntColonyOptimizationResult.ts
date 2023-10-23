import AntColonyOptimizationRoundResult from "./AntColonyOptimizationRoundResult";
import Vector from "./Vector";

export default interface AntColonyOptimizationResult<T extends Vector> {
  result: AntColonyOptimizationRoundResult<T>;
  history: AntColonyOptimizationRoundResult<T>[];
}
