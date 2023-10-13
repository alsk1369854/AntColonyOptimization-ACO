import AntColonyOptimization from "../../dist/AntColonyOptimization/AntColonyOptimization";
import Vector2D from "../../dist/AntColonyOptimization/interfaces/Vector2D";
import CanvasUtil from "../../dist/utils/CanvasUtil";

AntColonyOptimization;

// 最佳路程顯示標籤
let bestDistanceValueTag: HTMLSpanElement = document.getElementById(
  "bestDistanceValue"
) as HTMLSpanElement;
// 總城市數顯示標籤
let totalCityValueTag: HTMLSpanElement = document.getElementById(
  "totalCityValue"
) as HTMLSpanElement;
let cityAmount = 0;
// 運行時間標籤
let runTimeValueTage: HTMLSpanElement = document.getElementById(
  "runTimeValue"
) as HTMLSpanElement;

const canvasElement = CanvasUtil.getCanvasElement("canvas");

// 存儲要走訪的城市
let cityList: number[][] = [];
// 執行伐
let isRun = false;

// 存儲執行中的算法對象
let aco = null;

const updateTotalCityValue = () => {
  cityAmount = cityList.length;
  totalCityValueTag.innerHTML = `${cityAmount}`;
};

// 綁定在畫布中的點擊事件
canvasElement.addEventListener("mouseup", (event) => {
  if (isRun) return;
  // 在點擊的 x y 座標
  const { offsetX: x, offsetY: y } = event;
  // 將點擊座標加入 pointList 中
  cityList.push([x, y]);
  // 清空畫布
  CanvasUtil.clear(canvasElement);
  // 在畫布中劃出點擊點
  for (let i = 0; i < cityList.length; i++) {
    const { [0]: x, [1]: y } = cityList[i];
    CanvasUtil.drawPoint(canvasElement, x, y);
  }
  // 更新總城市數
  updateTotalCityValue();
});

// 綁定隨機位址點擊事件
const randomPositionBtn: HTMLButtonElement = document.getElementById(
  "randomPositionBtn"
) as HTMLButtonElement;
randomPositionBtn.addEventListener("click", (event) => {
  if (isRun) return;
  const temp: HTMLSelectElement = document.getElementById(
    "randomPositionAmount"
  ) as HTMLSelectElement;
  const randomPositionAmount = temp.value;
  for (let i = 0; i < +randomPositionAmount; i++) {
    // 隨機x y軸
    const x = Math.random() * (canvasElement.width - 30) + 15;
    const y = Math.random() * (canvasElement.height - 30) + 15;
    // 將點擊座標加入 pointList 中
    cityList.push([x, y]);
  }
  // 清空畫布
  CanvasUtil.clear(canvasElement);
  // 在畫布中劃出點擊點
  for (let i = 0; i < cityList.length; i++) {
    const { [0]: x, [1]: y } = cityList[i];
    CanvasUtil.drawPoint(canvasElement, x, y);
  }
  // 更新總城市數
  updateTotalCityValue();
});

// 綁定計算最點路徑按鈕點擊事件
const calculateShortestPathBtn: HTMLButtonElement = document.getElementById(
  "calculateShortestPathBtn"
) as HTMLButtonElement;
calculateShortestPathBtn.addEventListener("click", (event) => {
  if (cityList.length <= 0 || isRun) return;
  // 更新執行伐
  isRun = true;
  // 初始化路程與執行時間
  bestDistanceValueTag.innerHTML = "" + 0;
  runTimeValueTage.innerHTML = "" + 0;

  const vectorList: Vector2D[] = cityList.map((item) => {
    return {
      x: item[0],
      y: item[1],
    };
  });

  const aco = new AntColonyOptimization(vectorList);
  aco.getResult().then((result) => {
    if (!result) return;
    const bestAntTripResult = result.bestAntTripResult;
    // 劃出最佳路徑
    CanvasUtil.clear(canvasElement);
    for (let i = 1; i < bestAntTripResult.tripVectorList.length; i++) {
      const startVector = bestAntTripResult.tripVectorList[i - 1];
      const endVector = bestAntTripResult.tripVectorList[i];
      CanvasUtil.drawLine(
        canvasElement,
        startVector.x,
        startVector.y,
        endVector.x,
        endVector.y
      );
      CanvasUtil.drawPoint(canvasElement, endVector.x, endVector.y);
    }
    // 顯示數據至畫面
    bestDistanceValueTag.innerHTML = bestAntTripResult.distance.toFixed(2);
    runTimeValueTage.innerHTML = "0";
    // 更新執行伐
    isRun = false;
  });
});

// 綁定重置按鈕點擊事件
const resetBtn: HTMLButtonElement = document.getElementById(
  "resetBtn"
) as HTMLButtonElement;
resetBtn.addEventListener("click", (event) => {
  // if (isRun) return

  isRun = false;

  // 清空畫布
  CanvasUtil.clear(canvasElement);
  // 清空已標記的點
  cityList = [];
  // 更新總城市數
  updateTotalCityValue();
  // 更新最佳路徑距離
  bestDistanceValueTag.innerHTML = "0";
  runTimeValueTage.innerHTML = "0";
});
