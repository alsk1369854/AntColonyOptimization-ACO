import CanvasUtil from './modules/CanvasUtil'
import AOC from './modules/AOC'

(() => {
    // 創建畫布操作工具
    const canvasTag = document.getElementById('canvas')
    const canvas = new CanvasUtil(canvasTag)
    canvas.setWidth(450)
    canvas.setHeight(400)

    // 存儲要走訪的城市
    let cityList = []

    // 綁定在畫布中的點擊事件
    canvasTag.addEventListener('mouseup', event => {
        // 在點擊的 x y 座標
        const { offsetX: x, offsetY: y } = event
        // 將點擊座標加入 pointList 中
        cityList.push([x, y])
        // 在畫布中劃出點擊點
        canvas.drawPoint(x, y)
    })


    // 綁定隨機位址點擊事件
    const randomPositionBtn = document.getElementById('randomPositionBtn')
    randomPositionBtn.addEventListener('click', event => {
        const randomPositionAmount = document.getElementById('randomPositionAmount').value
        for (let i = 0; i < randomPositionAmount; i++) {
            // 隨機x y軸
            const x = Math.random() * (canvas.getWidth() - 1)
            const y = Math.random() * (canvas.getHeight() - 1)
            // 將點擊座標加入 pointList 中
            cityList.push([x, y])
            // 在畫布中劃出點擊點
            canvas.drawPoint(x, y)
        }
    })

    // 綁定計算最點路徑按鈕點擊事件
    const calculateShortestPathBtn = document.getElementById('calculateShortestPathBtn');
    calculateShortestPathBtn.addEventListener('click', event => {
        const aoc = new AOC(cityList)
        // console.log(aoc.getCityList())
        aoc.run()
        const bestRoute = aoc.getBestRoute()
        const bestRouteLength = aoc.getBestRouteLength()

        // 劃出最佳路徑
        canvas.clearCanvas();
        for(let i=1; i<bestRoute.length; i++){
            const {[0]:x, [1]:y} = bestRoute[i]
            canvas.drawLine(bestRoute[i-1],bestRoute[i])
            canvas.drawPoint(x, y)
        }
        console.log(bestRouteLength)
    })

    // 綁定重置按鈕點擊事件
    const resetBtn = document.getElementById('resetBtn')
    resetBtn.addEventListener('click', event => {
        // 清空畫布
        canvas.clearCanvas();
        // 清空已標記的點
        cityList = [];
    })
})()