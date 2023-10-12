import AntColonyOptimizationOption from "./interfaces/AntColonyOptimizationOption";
import AntColonyOptimizationOptionState from "./interfaces/AntColonyOptimizationOptionState";
import Vector2D from "./interfaces/Vector2D";
import Vector3D from "./interfaces/Vector3D";

export default class AntColonyOptimization {
  /**
   * 預設配置參數
   */
  static readonly DEFAULT_OPTION_STATE: AntColonyOptimizationOptionState = {
    antAmount: 30,
    maximumIterations: 200,
    initialPheromone: 1,
    pheromoneIncrement: 1,
    pheromoneWeakeningRate: 0.1,
    pheromoneWeight: 1,
    distanceWeight: 3,
  };

  /**
   * 向量序列
   */
  private readonly vector3DList: Vector3D[];

  /**
   * 配置參數
   */
  private readonly optionState: AntColonyOptimizationOptionState;

  /**
   * 距離矩陣
   */
  private distanceMatrix: number[][];

  /**
   * 能見度矩陣
   */
  private visibilityMatrix: number[][];

  /**
   * 費洛蒙矩陣
   */
  private pheromoneMatrix: number[][];

  constructor(
    vectorList: Vector2D[] | Vector3D[],
    option?: AntColonyOptimizationOption
  ) {
    this.vector3DList = this.getInitVector3DList(vectorList);
    this.optionState = this.getInitOptionState(option);
    this.distanceMatrix = this.getInitDistanceMatrix(this.vector3DList);
    this.visibilityMatrix = this.getInitVisibilityMatrix(this.distanceMatrix);
    this.pheromoneMatrix = this.getInitPheromoneMatrix(this.vector3DList);
  }

  private async start() {
    // 每次迭代
    for (
      let roundCount = 0;
      roundCount < this.optionState.maximumIterations;
      roundCount++
    ) {
      // 每隻螞蟻
      let eachAntsResult: number[][] = [];
      let currentAntResult: number[] = [];
      for (
        let antCount = 0;
        antCount < this.optionState.antAmount;
        antCount++
      ) {
        // 螞蟻起始準備
        let candidateVectorMap: Map<number, Vector3D> =
          this.getInitCandidateVectorMap(this.vector3DList);
        let currentVectorIndex: number = this.pickRandomKey(candidateVectorMap);
        currentAntResult = [currentVectorIndex];

        // 每個向量，走遍所有向量，i = 1 (扣除起始點)
        for (let i = 1; 1 < this.vector3DList.length; i++) {
          currentVectorIndex = this.pickRouletteWheelKey(
            currentVectorIndex,
            candidateVectorMap
          );
          currentAntResult.push(currentVectorIndex);
        }
      }
      eachAntsResult.push(currentAntResult);
    }
    // 更新費洛蒙舉矩陣
  }

  private updatePheromonMatrix(eachAntsResult: number[][]) {
    this.pheromoneMatrix = this.getPheromoneMatrixWeakening(
      this.optionState.pheromoneWeakeningRate
    );
  }

  /**
   * 獲得 費洛蒙訊息削弱矩陣
   * @param pheromoneWeakeningRate 費洛蒙衰退率 0~1
   * @returns 費洛蒙訊息削弱矩陣
   */
  private getPheromoneMatrixWeakening(pheromoneWeakeningRate: number) {
    return this.pheromoneMatrix.map((matrix1D) => {
      return matrix1D.map((pheromone) => {
        return pheromone * (1 - pheromoneWeakeningRate);
      });
    });
  }

  /**
   * 挑起 下一個前往的向量，使用隨機輪盤法
   * @param currentVectorIndex 當前所在的 向量 index
   * @param candidateVectorMap 候選的向量 Map (key 將會被挑起)
   * @returns 下個前往的向量 Key ; index
   */
  private pickRouletteWheelKey(
    currentVectorIndex: number,
    candidateVectorMap: Map<number, Vector3D>
  ): number {
    // 機算前往每個候選向量的機率
    const candidateVectorProbabilityMap: Map<number, number> =
      this.getInitCandidateVectorProbabilityMap(
        currentVectorIndex,
        candidateVectorMap
      );

    // 隨機伐值
    const threshold: number = Math.random();

    // 開始隨機輪盤法
    let probabilitySum: number = 0;
    let lastIndex: number = this.getRandomKey(candidateVectorProbabilityMap);
    for (const [
      index,
      probability,
    ] of candidateVectorProbabilityMap.entries()) {
      probabilitySum += probability;
      lastIndex = index;
      if (probabilitySum >= threshold) break;
    }

    // 挑起下一個向量目標
    candidateVectorMap.delete(lastIndex);
    return lastIndex;
  }

  /**
   * [初始化] 獲取 所有候選向量前往機率(0~1) Map
   * @param currentVectorIndex 當前所在的 向量 index
   * @param candidateVectorMap 候選的向量 Map
   * @returns 所有候選向量前往機率(0~1) Map
   */
  private getInitCandidateVectorProbabilityMap(
    currentVectorIndex: number,
    candidateVectorMap: Map<number, Vector3D>
  ): Map<number, number> {
    let result: Map<number, number> = new Map();

    // 前往所有向量，機率之合
    let probabilitySum: number = 0;

    // 根據舉證計算個向量的前往機率
    candidateVectorMap.forEach((_, index) => {
      const pheromoneValue: number = Math.pow(
        this.pheromoneMatrix[currentVectorIndex][index],
        this.optionState.pheromoneWeight
      );
      const visibilityValue: number = Math.pow(
        this.visibilityMatrix[currentVectorIndex][index],
        this.optionState.distanceWeight
      );
      const probability: number = pheromoneValue * visibilityValue;
      probabilitySum += probability;
      result.set(index, probability);
    });

    // 將所有機率映射到 0~1
    result.forEach((probability, index) => {
      result.set(index, probability / probabilitySum);
    });

    return result;
  }

  /**
   * 挑起 集合的隨機的一個 key 值
   * @param collection 集合類 (key 將會被挑起)
   * @returns key
   */
  private pickRandomKey<T>(collection: Map<T, any> | Set<T>): T {
    const key: T = this.getRandomKey(collection);
    collection.delete(key);
    return key;
  }

  /**
   * 獲取 集合的隨機的一個 key 值
   * @param collection 集合類
   * @returns key
   */
  private getRandomKey<T>(collection: Map<T, any> | Set<T>): T {
    const keys = Array.from(collection.keys());
    return keys[Math.floor(Math.random() * keys.length)];
  }

  /**
   * [初始化] 獲取 候選向量 Map 物件
   * @param vector3DList 向量序列
   * @returns 候選向量 Map 物件
   */
  private getInitCandidateVectorMap(
    vector3DList: Vector3D[]
  ): Map<number, Vector3D> {
    let result: Map<number, Vector3D> = new Map();
    this.vector3DList.forEach((vector, i) => {
      result.set(i, vector);
    });

    return this.getInitCandidateVectorMap(vector3DList);
  }

  /**
   * [初始化] 獲取 this.pheromoneMatrix 初始值
   * @param vector3DList 向量序列
   * @returns this.pheromoneMatrix 初始值
   */
  private getInitPheromoneMatrix(vector3DList: Vector3D[]): number[][] {
    return vector3DList.map(() => {
      return vector3DList.map(() => {
        return this.optionState.initialPheromone;
      });
    });
  }

  /**
   * [初始化] 獲取 this.visibilityMatrix 初始值
   * @param distanceMatrix 距離矩陣
   * @returns this.visibilityMatrix 初始值
   */
  private getInitVisibilityMatrix(distanceMatrix: number[][]): number[][] {
    return distanceMatrix.map((distance1DItem) => {
      return distance1DItem.map((distance) => {
        return 1 / distance;
      });
    });
  }

  /**
   * [初始化] 獲取 this.distanceMatrix 初始值
   * @param vector3DList 向量序列
   * @returns this.distanceMatrix 初始值
   */
  private getInitDistanceMatrix(vector3DList: Vector3D[]): number[][] {
    function getDistance(vectorA: Vector3D, vectorB: Vector3D): number {
      return Math.sqrt(
        Math.pow(vectorA.x - vectorB.x, 2) +
          Math.pow(vectorA.y - vectorB.y, 2) +
          Math.pow(vectorA.z - vectorB.z, 2)
      );
    }
    return vector3DList.map((vectorI, i) => {
      return vector3DList.map((vectorJ, j) => {
        return getDistance(vectorI, vectorJ);
      });
    });
  }

  /**
   * [初始化] 獲取 this.optionState 初始值
   * @param option 配置設定
   * @returns this.optionState 初始值
   */
  private getInitOptionState(
    option: AntColonyOptimizationOption = AntColonyOptimization.DEFAULT_OPTION_STATE
  ) {
    return {
      ...AntColonyOptimization.DEFAULT_OPTION_STATE,
      ...option,
    };
  }

  /**
   * [初始化] 獲取 this.vector3DList 初始值
   * @param vectorList 向量類序列
   * @returns this.vector3DList 初始值
   */
  private getInitVector3DList(vectorList: Vector2D[] | Vector3D[]): Vector3D[] {
    return vectorList.map((vector) => {
      const vector3D = vector as Vector3D;
      if (vector3D.z === undefined) {
        vector3D.z = 0;
      }
      return { x: vector3D.x, y: vector3D.y, z: vector3D.z };
    });
  }
}
