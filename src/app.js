import CanvasUtil from './modules/CanvasUtil'
import LoadingBar from './modules/LoadingBar'
import ACO from './modules/ACO'

(() => {

    // 最佳路程顯示標籤
    const bestDistanceValueTag = document.getElementById('bestDistanceValue')
    // 總城市數顯示標籤
    const totalCityValueTag = document.getElementById('totalCityValue')
    let cityAmount = 0
    // 運行時間標籤
    const runTimeValueTage = document.getElementById('runTimeValue');
    // 存儲要走訪的城市
    let cityList = []

    const updateTotalCityValue = () => {
        cityAmount = cityList.length
        totalCityValueTag.innerHTML = cityAmount
    }

    // 綁定在畫布中的點擊事件
    CanvasUtil.getTag().addEventListener('mouseup', event => {
        // 在點擊的 x y 座標
        const { offsetX: x, offsetY: y } = event
        // 將點擊座標加入 pointList 中
        cityList.push([x, y])
        // 在畫布中劃出點擊點
        CanvasUtil.drawPoint(x, y)
        // 更新總城市數
        updateTotalCityValue()
    })


    // 綁定隨機位址點擊事件
    const randomPositionBtn = document.getElementById('randomPositionBtn')
    randomPositionBtn.addEventListener('click', event => {
        const randomPositionAmount = document.getElementById('randomPositionAmount').value
        for (let i = 0; i < randomPositionAmount; i++) {
            // 隨機x y軸
            const x = Math.random() * (CanvasUtil.getWidth() - 1)
            const y = Math.random() * (CanvasUtil.getHeight() - 1)
            // 將點擊座標加入 pointList 中
            cityList.push([x, y])
            // 在畫布中劃出點擊點
            CanvasUtil.drawPoint(x, y)
        }
        // 更新總城市數
        updateTotalCityValue()
    })

    // 綁定計算最點路徑按鈕點擊事件
    const calculateShortestPathBtn = document.getElementById('calculateShortestPathBtn');
    calculateShortestPathBtn.addEventListener('click', async event => {
        if (cityList.length <= 0) return


        const aco = new ACO(cityList)
        /*
            * 將城市清單傳入創建 ACO 物件
            cityList =
            0: (2) [35.212731258971694, 192.4828380031023]
            1: (2) [406.7893800046783, 353.11516232128866]
            2: (2) [203.79469153183967, 239.43525762360284]
            3: (2) [203.63797886159924, 303.82642780553886]
            4: (2) [437.7676408659259, 306.5314600212263]
            5: (2) [155.3177116443413, 126.45807928516383]
            6: (2) [178.36759944327554, 173.25006961263063]
            7: (2) [92.13800512190628, 65.69702123912263]
            8: (2) [263.6048907161056, 34.919847014702256]
            9: (2) [399.35957106588666, 264.9649031596936]
        */
       
        // 運行螞蟻演算法
        await aco.run()

        // 獲取最終結果
        const bestRoute = aco.getBestRoute()
        /*
            0: (2) [92.13800512190628, 65.69702123912263]
            1: (2) [35.212731258971694, 192.4828380031023]
            2: (2) [155.3177116443413, 126.45807928516383]
            3: (2) [178.36759944327554, 173.25006961263063]
            4: (2) [203.79469153183967, 239.43525762360284]
            5: (2) [203.63797886159924, 303.82642780553886]
            6: (2) [406.7893800046783, 353.11516232128866]
            7: (2) [437.7676408659259, 306.5314600212263]
            8: (2) [399.35957106588666, 264.9649031596936]
            9: (2) [263.6048907161056, 34.919847014702256]
            10: (2) [92.13800512190628, 65.69702123912263]
        */

        const bestRouteLength = aco.getBestRouteLength()
        /**
         * 1226.3942916446954
         */

        const runTime = aco.getRunTime()
        /**
         * 1
         */

        // 劃出最佳路徑
        CanvasUtil.clearCanvas();
        for (let i = 1; i < bestRoute.length; i++) {
            const { [0]: x, [1]: y } = bestRoute[i]
            CanvasUtil.drawLine(bestRoute[i - 1], bestRoute[i])
            CanvasUtil.drawPoint(x, y)
        }
        bestDistanceValueTag.innerHTML = bestRouteLength.toFixed(2)
        runTimeValueTage.innerHTML = runTime
    })

    // 綁定重置按鈕點擊事件
    const resetBtn = document.getElementById('resetBtn')
    resetBtn.addEventListener('click', event => {
        // 清空畫布
        CanvasUtil.clearCanvas();
        // 初始畫讀條
        LoadingBar.setPersent(0);
        // 清空已標記的點
        cityList = [];
        // 更新總城市數
        updateTotalCityValue()
        // 更新最佳路徑距離
        bestDistanceValueTag.innerHTML = 0
        runTimeValueTage.innerHTML = 0
    })
})()