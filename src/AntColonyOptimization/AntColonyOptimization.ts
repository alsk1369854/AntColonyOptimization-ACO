import AntColonyOptimizationOption from "./interfaces/AntColonyOptimizationOption";
import AntColonyOptimizationOptionState from "./interfaces/AntColonyOptimizationOptionState";
import AntTripResult from "./modules/AntTripResult";
import Vector from "./interfaces/Vector";
import AntColonyOptimizationResult from "./interfaces/AntColonyOptimizationResult";
import Vector3D from "./interfaces/Vector3D";

export default class AntColonyOptimization<V extends Vector> {
  /**
   * 預設配置參數
   */
  static readonly DEFAULT_OPTION_STATE: AntColonyOptimizationOptionState = {
    antAmount: 30,
    maximumRounds: 200,
    onRoundEnds: (_: AntColonyOptimizationResult<Vector>) => {},
    initialPheromone: 1,
    pheromoneIncrement: 1,
    pheromoneWeakeningRate: 0.1,
    pheromoneWeight: 1,
    distanceWeight: 3,
  };

  /**
   * 向量序列
   */
  private readonly vectorList: Vector3D[];

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

  /**
   * 每回合的歷史結果
   */
  private roundResultHistory: AntColonyOptimizationResult<V>[] = [];

  /**
   * 螞蟻演算法計算結果
   */
  private result: Promise<AntColonyOptimizationResult<V> | undefined>;

  /**
   * 構造器
   * @param vectorList 向量序列
   * @param option 配置參數
   */
  constructor(vectorList: V[], option?: AntColonyOptimizationOption) {
    this.vectorList = this.getInitVector3DList(vectorList);
    this.checkVectorListValidity(this.vectorList as V[]);

    this.optionState = this.getInitOptionState(option);
    this.checkOptionStateValidity(this.optionState);

    this.distanceMatrix = this.getInitDistanceMatrix(this.vectorList);
    this.visibilityMatrix = this.getInitVisibilityMatrix(this.distanceMatrix);
    this.pheromoneMatrix = this.getInitPheromoneMatrix(this.vectorList as V[]);

    this.result = this.start();
  }

  /**
   * 獲得 螞蟻演算法計算結果
   * @returns 螞蟻演算法計算結果
   */
  public async getResult(): Promise<
    AntColonyOptimizationResult<V> | undefined
  > {
    return await this.result;
  }

  /**
   * 獲得 當前進度的回合歷史結果
   * @returns 當前進度的回合歷史結果
   */
  public getRoundResultHistory(): AntColonyOptimizationResult<V>[] {
    return this.roundResultHistory;
  }

  /**
   * 開始計算螞蟻演算法
   * @returns 螞蟻演算法計算結果
   */
  private async start(): Promise<AntColonyOptimizationResult<V> | undefined> {
    let result: AntColonyOptimizationResult<V> | undefined = undefined;

    /**
     * 最佳的螞蟻旅行結果
     */
    let bestAntTripResult: AntTripResult<V> | undefined = undefined;

    // 每回合
    for (
      let roundCount = 0;
      roundCount < this.optionState.maximumRounds;
      roundCount++
    ) {
      // 每隻螞蟻
      // 所有螞蟻的旅途(經過向量的 Index)結果
      let antsTripIndexList: number[][] = [];
      let currentAntTripIndexList: number[] = [];
      for (
        let antCount = 0;
        antCount < this.optionState.antAmount;
        antCount++
      ) {
        // 螞蟻起始準備
        let candidateVectorMap: Map<number, V> = this.getInitCandidateVectorMap(
          this.vectorList
        );
        let currentVectorIndex: number = this.pickRandomKey(candidateVectorMap);
        currentAntTripIndexList = [currentVectorIndex];

        // 走遍所有候選向量
        while (candidateVectorMap.size !== 0) {
          currentVectorIndex = this.pickKeyByRouletteWheel(
            currentVectorIndex,
            candidateVectorMap
          );
          currentAntTripIndexList.push(currentVectorIndex);
        }

        // 回到起點，行程一個環
        currentAntTripIndexList.push(currentAntTripIndexList[0]);

        // 添加至本回合解果集
        antsTripIndexList.push(currentAntTripIndexList);
      }
      // 更新費洛蒙舉矩陣
      const antsTripResultList: AntTripResult<V>[] = antsTripIndexList.map(
        (antTripIndexList) => this.getAntTripResult(antTripIndexList)
      );
      this.pheromoneMatrix =
        this.getNextRoundPheromonMatrix(antsTripResultList);

      // 更新歷史最佳解果
      const roundBestAntTripResult: AntTripResult<V> =
        this.getBestAntTripResult(antsTripResultList);
      if (bestAntTripResult === undefined) {
        bestAntTripResult = roundBestAntTripResult;
      } else {
        if (roundBestAntTripResult.betterThen(bestAntTripResult)) {
          bestAntTripResult = roundBestAntTripResult;
        }
      }

      // 更新結果
      result = {
        roundCount,
        antsTripResultList,
        roundBestAntTripResult,
        bestAntTripResult,
      };
      this.roundResultHistory.push(result);

      // 執行回合結束回調
      this.optionState.onRoundEnds(result, this.roundResultHistory);
    }

    return result;
  }

  /**
   * 獲取回合結果集中的最佳結果
   * @param antsTripResultList 回合結果集
   * @returns 最佳結果
   */
  private getBestAntTripResult(
    antsTripResultList: AntTripResult<V>[]
  ): AntTripResult<V> {
    return antsTripResultList.reduce((bestAntTripResult, antTripResult) => {
      if (antTripResult.betterThen(bestAntTripResult)) {
        return antTripResult;
      }
      return bestAntTripResult;
    }, antsTripResultList[0]);
  }

  /**
   * 獲取 下一回合的 費洛蒙矩陣
   * @param antsTripResultList 此回合所有螞蟻的旅行結果
   * @returns 下一回合的 費洛蒙矩陣
   */
  private getNextRoundPheromonMatrix(
    antsTripResultList: AntTripResult<V>[]
  ): number[][] {
    // 基本增量
    let nextPheromoneMatrix = this.getPheromoneMatrixWeakening(
      this.optionState.pheromoneWeakeningRate
    );

    // 旅程路線增量
    antsTripResultList.forEach((antTripResult) => {
      const pheromoneIncrease: number =
        this.optionState.pheromoneIncrement / antTripResult.distance;

      let prevVectorIndex: number = -1;
      antTripResult.tripIndexList.forEach((currVectorIndex) => {
        if (prevVectorIndex !== -1) {
          nextPheromoneMatrix[prevVectorIndex][currVectorIndex] +=
            pheromoneIncrease;
        }
        prevVectorIndex = currVectorIndex;
      });
    });
    return nextPheromoneMatrix;
  }

  /**
   * 獲取 螞蟻旅行結果
   * @param antTripIndexList 螞蟻旅行經過的向量 index 途徑
   * @returns 螞蟻旅行結果
   */
  private getAntTripResult(antTripIndexList: number[]): AntTripResult<V> {
    return new AntTripResult<V>(
      this.vectorList as V[],
      this.distanceMatrix,
      antTripIndexList
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
  private pickKeyByRouletteWheel(
    currentVectorIndex: number,
    candidateVectorMap: Map<number, V>
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
    candidateVectorMap: Map<number, V>
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
   * @param vectorList 向量序列
   * @returns 候選向量 Map 物件
   */
  private getInitCandidateVectorMap(vectorList: Vector3D[]): Map<number, V> {
    let result: Map<number, V> = new Map();
    this.vectorList.forEach((vector, i) => {
      result.set(i, vector as V);
    });
    return result;
  }

  /**
   * [初始化] 獲取 this.pheromoneMatrix 初始值
   * @param vectorList 向量序列
   * @returns this.pheromoneMatrix 初始值
   */
  private getInitPheromoneMatrix(vectorList: V[]): number[][] {
    return vectorList.map(() => {
      return vectorList.map(() => {
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
   * @param vectorList 向量序列
   * @returns this.distanceMatrix 初始值
   */
  private getInitDistanceMatrix(vectorList: Vector3D[]): number[][] {
    function getDistance(vectorA: Vector3D, vectorB: Vector3D): number {
      return Math.sqrt(
        Math.pow(vectorA.x - vectorB.x, 2) +
          Math.pow(vectorA.y - vectorB.y, 2) +
          Math.pow(vectorA.z - vectorB.z, 2)
      );
    }
    return vectorList.map((vectorI, i) => {
      return vectorList.map((vectorJ, j) => {
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
   * [驗證] 檢查 vectorList 是否合規
   * @param vectorList Vectory[] 物件
   * @returns 是否合規
   */
  private checkVectorListValidity(vectorList: V[]): boolean {
    if (vectorList.length === 0) {
      throw new Error(`vectorList 不可為空陣列`);
    }

    return true;
  }

  /**
   * [驗證] 檢查 optionState 是否合規
   * @param optionState AntColonyOptimizationOptionState 物件
   * @returns 是否合規
   */
  private checkOptionStateValidity(
    optionState: AntColonyOptimizationOptionState
  ): boolean {
    if (optionState.maximumRounds <= 0) {
      throw new Error(`optionState.maximumRounds 必須大於 0`);
    }

    if (optionState.antAmount <= 0) {
      throw new Error(`optionState.antAmount 必須大於 0`);
    }

    return true;
  }

  // /**
  //  * [初始化] 獲取 this.vectorList 初始值
  //  * @param vectorList 向量類序列
  //  * @returns this.vectorList 初始值
  //  */
  private getInitVector3DList(vectorList: V[]): Vector3D[] {
    return vectorList.map((vector) => {
      // @ts-ignore
      const z = vector.z ?? 0;
      return { x: vector.x, y: vector.y, z };
    });
  }
}
