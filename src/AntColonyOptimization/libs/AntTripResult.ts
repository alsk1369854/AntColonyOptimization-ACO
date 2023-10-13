import Vector from "../interfaces/Vector";

export default class AntTripResult<V extends Vector> {
  public readonly tripVectorList: V[];
  public readonly tripIndexList: number[];
  public readonly distance: number;

  private readonly vectorList: V[];
  private readonly distanceMatrix: number[][];

  constructor(
    vectorList: V[],
    distanceMatrix: number[][],
    tripIndexList: number[]
  ) {
    this.vectorList = vectorList;
    this.distanceMatrix = distanceMatrix;
    this.tripIndexList = tripIndexList;
    this.tripVectorList = this.tripIndexList.map(
      (index) => this.vectorList[index]
    );
    this.distance = this.getTripIndexListDistance(this.tripIndexList);
  }

  /**
   * 獲取 螞蟻旅程的 總距離
   * @param antTripIndexResult 螞蟻所走訪的向量 index 順序
   * @returns 螞蟻旅程的 總距離
   */
  private getTripIndexListDistance(tripIndexList: number[]): number {
    let prevVectorIndex: number = -1;
    return tripIndexList.reduce((tripDistance, currVectorIndex) => {
      let newTripDistance: number = tripDistance;
      if (prevVectorIndex !== -1) {
        newTripDistance +=
          this.distanceMatrix[prevVectorIndex][currVectorIndex];
      }
      prevVectorIndex = currVectorIndex;
      return newTripDistance;
    }, 0);
  }

  /**
   * 比較結果是否較為優異
   * @param antTripResult 比對的目標物件
   * @returns 是否優於目標物件
   */
  public betterThen(antTripResult: AntTripResult<V>): boolean {
    return this.distance < antTripResult.distance;
  }
}
