import AntColonyOptimizationOption from "./interfaces/AntColonyOptimizationOption";
import AntColonyOptimizationOptionState from "./interfaces/AntColonyOptimizationOptionState";
import AntColonyOptimizationRoundResult from "./interfaces/AntColonyOptimizationRoundResult";
import AntColonyOptimizationResult from "./interfaces/AntColonyOptimizationResult";
import TripResult from "./modules/TripResult";
import Vector from "./interfaces/Vector";
import Vector3D from "./interfaces/Vector3D";

export default class AntColonyOptimization<V extends Vector> {
  /**
   * 預設配置參數
   */
  private static readonly DEFAULT_OPTION_STATE: AntColonyOptimizationOptionState =
    {
      antAmount: 30,
      maximumRounds: 200,
      onRoundEnds: () => {},
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
    this.checkVectorListValidity(this.vectorList);

    this.optionState = this.getInitOptionState(option);
    this.checkOptionStateValidity(this.optionState);

    this.distanceMatrix = this.getInitDistanceMatrix(this.vectorList);
    this.visibilityMatrix = this.getInitVisibilityMatrix(this.distanceMatrix);
    this.pheromoneMatrix = this.getInitPheromoneMatrix(
      this.vectorList,
      this.optionState.initialPheromone
    );

    this.result = this.start(
      this.optionState.maximumRounds,
      this.optionState.antAmount,
      this.optionState.pheromoneWeight,
      this.optionState.pheromoneWeakeningRate,
      this.optionState.pheromoneIncrement,
      this.optionState.onRoundEnds
    );
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
   * 開始計算螞蟻演算法
   * @param maximumRounds 最大迭代回合
   * @param antAmount 螞蟻數量
   * @param pheromoneWeight 費洛蒙權重
   * @param pheromoneWeakeningRate 費洛蒙衰退率 (0~1)
   * @param pheromoneIncrement 每隻螞蟻經過路徑費洛蒙增量 (增量 / 螞蟻行走距離)
   * @param onRoundEnds [回調] 回合結束時
   * @returns 螞蟻演算法計算結果
   */
  private async start(
    maximumRounds: number,
    antAmount: number,
    pheromoneWeight: number,
    pheromoneWeakeningRate: number,
    pheromoneIncrement: number,
    onRoundEnds: AntColonyOptimizationOptionState["onRoundEnds"] = () => {}
  ): Promise<AntColonyOptimizationResult<V> | undefined> {
    // 算法運行結果
    let result: AntColonyOptimizationResult<V> | undefined = undefined;

    // 每回合的歷史結果
    let roundResultHistory: AntColonyOptimizationRoundResult<V>[] = [];

    // 歷史最佳的螞蟻旅行結果
    let historyBestTripResult: TripResult<V> | undefined = undefined;

    // 每回合
    for (let roundCount = 0; roundCount < maximumRounds; roundCount++) {
      // 本回合所有螞蟻的旅行結果
      const antsTripIndexList: number[][] = this.roundStart(
        antAmount,
        pheromoneWeight
      );

      // 更新費洛蒙舉矩陣
      const tripResultList: TripResult<V>[] = antsTripIndexList.map(
        (antTripIndexList) => this.getTripResult(antTripIndexList)
      );
      this.pheromoneMatrix = this.getNextRoundPheromonMatrix(
        tripResultList,
        pheromoneWeakeningRate,
        pheromoneIncrement
      );

      // 更新歷史最佳解果
      const roundBestTripResult: TripResult<V> =
        this.getBestTripResult(tripResultList);
      if (historyBestTripResult === undefined) {
        historyBestTripResult = roundBestTripResult;
      } else {
        if (roundBestTripResult.betterThen(historyBestTripResult)) {
          historyBestTripResult = roundBestTripResult;
        }
      }

      // 當前回合計算結果
      const currentRoundResult: AntColonyOptimizationRoundResult<V> = {
        roundCount,
        tripResultList,
        roundBestTripResult,
        historyBestTripResult,
      };
      // 更新結果
      roundResultHistory.push(currentRoundResult);
      result = {
        lastRound: roundResultHistory[roundCount],
        history: roundResultHistory,
      };

      // 執行回合結束回調
      onRoundEnds(result as AntColonyOptimizationResult<Vector3D>);

      // 讓任務進入宏任務，防止頁面渲染因計算變卡頓
      await this.sleep(0);
    }

    return result;
  }

  /**
   * 回合開始，陸續送螞蟻走完旅程
   * @param antAmount 螞蟻數量
   * @param pheromoneWeight 費洛蒙權重
   * @returns 本回合所有螞蟻的旅行結果
   */
  private roundStart(antAmount: number, pheromoneWeight: number): number[][] {
    // 所有螞蟻的旅途(經過向量的 Index)結果集合
    let antsTripIndexList: number[][] = [];

    // 每一隻螞蟻
    for (let antCount = 0; antCount < antAmount; antCount++) {
      // 本隻螞蟻旅行路徑
      const antTripIndexList: number[] = this.antTripStart(
        this.vectorList,
        pheromoneWeight
      );

      // 添加至本回合結果集
      antsTripIndexList.push(antTripIndexList);
    }
    return antsTripIndexList;
  }

  /**
   * 送一隻螞蟻出去走一趟旅程
   * @param vectoryList 旅程座標向量序列
   * @param pheromoneWeight 費洛蒙權重
   * @returns 此之螞蟻依序走訪的向量 index 序列
   */
  private antTripStart(
    vectoryList: Vector3D[],
    pheromoneWeight: number
  ): number[] {
    let antTripIndexList: number[] = [];
    // 螞蟻起始準備
    let candidateVectorMap: Map<number, V> =
      this.getInitCandidateVectorMap(vectoryList);
    let currentVectorIndex: number = this.pickRandomKey(candidateVectorMap);
    antTripIndexList = [currentVectorIndex];

    // 走遍所有候選向量
    while (candidateVectorMap.size !== 0) {
      currentVectorIndex = this.pickKeyByRouletteWheel(
        currentVectorIndex,
        candidateVectorMap,
        pheromoneWeight
      );
      antTripIndexList.push(currentVectorIndex);
    }

    // 回到起點，行程一個環
    antTripIndexList.push(antTripIndexList[0]);
    return antTripIndexList;
  }

  /**
   * 獲取回合結果集中的最佳結果
   * @param tripResultList 回合結果集
   * @returns 最佳結果
   */
  private getBestTripResult(tripResultList: TripResult<V>[]): TripResult<V> {
    return tripResultList.reduce((historyBestTripResult, antTripResult) => {
      if (antTripResult.betterThen(historyBestTripResult)) {
        return antTripResult;
      }
      return historyBestTripResult;
    }, tripResultList[0]);
  }

  /**
   * 獲取 下一回合的 費洛蒙矩陣
   * @param tripResultList 此回合所有螞蟻的旅行結果
   * @param pheromoneWeakeningRate 費洛蒙衰退率 (0~1)
   * @param pheromoneIncrement 每隻螞蟻經過路徑費洛蒙增量 (增量 / 螞蟻行走距離)
   * @returns 下一回合的 費洛蒙矩陣
   */
  private getNextRoundPheromonMatrix(
    tripResultList: TripResult<V>[],
    pheromoneWeakeningRate: number,
    pheromoneIncrement: number
  ): number[][] {
    // 基本增量
    let nextPheromoneMatrix = this.getPheromoneMatrixWeakening(
      pheromoneWeakeningRate
    );

    // 旅程路線增量
    tripResultList.forEach((antTripResult) => {
      const pheromoneIncrease: number =
        pheromoneIncrement / antTripResult.distance;

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
   * @param tripIndexList 螞蟻旅行經過的向量 index 途徑
   * @returns 螞蟻旅行結果
   */
  private getTripResult(tripIndexList: number[]): TripResult<V> {
    return new TripResult<V>(
      this.vectorList as V[],
      this.distanceMatrix,
      tripIndexList
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
   * @param pheromoneWeight 費洛蒙權重
   * @returns 下個前往的向量 Key ; index
   */
  private pickKeyByRouletteWheel(
    currentVectorIndex: number,
    candidateVectorMap: Map<number, V>,
    pheromoneWeight: number
  ): number {
    // 機算前往每個候選向量的機率
    const candidateVectorProbabilityMap: Map<number, number> =
      this.getInitCandidateVectorProbabilityMap(
        currentVectorIndex,
        candidateVectorMap,
        pheromoneWeight
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
   * @param pheromoneWeight 費洛蒙權重
   * @returns 所有候選向量前往機率(0~1) Map
   */
  private getInitCandidateVectorProbabilityMap(
    currentVectorIndex: number,
    candidateVectorMap: Map<number, V>,
    pheromoneWeight: number
  ): Map<number, number> {
    let result: Map<number, number> = new Map();

    // 前往所有向量，機率之合
    let probabilitySum: number = 0;

    // 根據舉證計算個向量的前往機率
    candidateVectorMap.forEach((_, index) => {
      const pheromoneValue: number = Math.pow(
        this.pheromoneMatrix[currentVectorIndex][index],
        pheromoneWeight
      );
      const visibilityValue: number = Math.pow(
        this.visibilityMatrix[currentVectorIndex][index],
        pheromoneWeight
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
   * @param initialPheromone 初始費洛蒙
   * @returns this.pheromoneMatrix 初始值
   */
  private getInitPheromoneMatrix(
    vectorList: Vector3D[],
    initialPheromone: number
  ): number[][] {
    return vectorList.map(() => {
      return vectorList.map(() => {
        return initialPheromone;
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
   * @param vectorList Vector3D[] 物件
   * @returns 是否合規
   */
  private checkVectorListValidity(vectorList: Vector3D[]): boolean {
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

  /**
   * [初始化] 獲取 this.vectorList 初始值
   * @param vectorList 向量類序列
   * @returns this.vectorList 初始值
   */
  private getInitVector3DList(vectorList: V[]): Vector3D[] {
    return vectorList.map((vector) => {
      // @ts-ignore
      const z = vector.z ?? 0;
      return { x: vector.x, y: vector.y, z };
    });
  }

  /**
   * 等待一段時間，可以強制讓計算進入宏任務，以防止頁面卡頓
   * @param ms 微秒 1000 = 1 秒
   * @returns undefined
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
  }
}
