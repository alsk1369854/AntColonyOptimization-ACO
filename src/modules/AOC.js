export default class AOC {


    constructor(cityList) {
        this.cityList = [...cityList]
        this.cityLength = this.cityList.length
        this.cityIDList = this.cityList.map((_, index) => index)

        this.ColonySize = 30 // 螞蟻數量
        this.MaxIterations = 200 // 最大回合數
        this.Alpha = 1 // 費洛蒙權重係數
        this.Beta = 3 // 城市距離權重係數 ( Beta > Alpha 結果較佳)
        this.Rho = 0.1 // 費洛蒙衰弱係數 New Pheromone *= ( 1 - Rho )
        this.InitialPheromone = 1 // 初始費洛蒙
        this.PheromoneDepositWeight = 1 // 費洛蒙重量

        // 城市距離矩陣
        this.distanceMatrix = []

        // 費洛蒙矩陣
        this.pheromoneMatrix = []

        // 存儲最佳路徑 
        this.bestRoute = []
        this.bestRouteLength = Number.MAX_SAFE_INTEGER

        // 距離矩陣與初始費洛蒙矩陣
        this.buildDistanceMatrix(this.cityList)
        this.buildInitialPheromoneMatrix()
    }
    getBestRoute() {
        return this.bestRoute.map(cityID => this.cityList[cityID])
    }
    getBestRouteLength() {
        return this.bestRouteLength
    }

    // 機算兩城市間的距離
    claculateTheDistanceBetweenTwoOption(positionOne, positionTwo) {
        const { [0]: oneX, [1]: oneY } = positionOne
        const { [0]: twoX, [1]: twoY } = positionTwo
        return Math.sqrt(Math.pow(twoX - oneX, 2) + Math.pow(twoY - oneY, 2))
    }
    // 建立城市能見度矩陣
    buildDistanceMatrix(cityList) {
        for (let i = 0; i < this.cityLength; i++) {
            this.distanceMatrix.push([])
            for (let j = 0; j < this.cityLength; j++) {
                this.distanceMatrix[i].push(1 / this.claculateTheDistanceBetweenTwoOption(cityList[i], cityList[j]))
            }
        }
    }

    // 建立初始費洛蒙矩陣
    buildInitialPheromoneMatrix() {
        for (let i = 0; i < this.cityLength; i++) {
            this.pheromoneMatrix.push([])
            for (let j = 0; j < this.cityLength; j++) {
                this.pheromoneMatrix[i].push(this.InitialPheromone)
            }
        }
    }

    // 隨機輪盤法
    doRouletteWheelSelection(candidateCityProbabilityList) {
        // 所有機率之和
        let sumProbability = candidateCityProbabilityList.reduce((previusValue, currentValue) => previusValue += currentValue, 0)
        // 每個地點的機率表(和為1)
        let probability = candidateCityProbabilityList.map(item => item / sumProbability)
        // 開始輪盤法
        const randomNuber = Math.random()
        let sumProb = 0
        for (let i = 0; i < probability.length; i++) {
            sumProb += probability[i]
            if (sumProb >= randomNuber) return i
        }
    }

    // 更新費洛蒙居矩陣
    updatePheromoneMatrix(IterationResultList) {
        // 費洛蒙衰退
        for (let i = 0; i < this.cityLength; i++) {
            for (let j = 0; j < this.cityLength; j++) {
                this.pheromoneMatrix[i][j] *= (1 - this.Rho)
            }
        }
        // 增加回合路徑費洛蒙
        for (let i = 0; i < IterationResultList.length; i++) {
            let routeLen = 0
            for (let j = 1; j < IterationResultList[i].length; j++) {
                routeLen += this.claculateTheDistanceBetweenTwoOption(this.cityList[IterationResultList[i][j-1]], this.cityList[IterationResultList[i][j]])
            }
            // 更新最短路徑
            if (routeLen < this.bestRouteLength) {
                this.bestRoute = [...IterationResultList[i]]
                this.bestRouteLength = routeLen
            }
            // 螞蟻走過路徑費洛蒙
            const addPheromoneAmount = this.PheromoneDepositWeight / routeLen
            for (let j = 1; j < IterationResultList[i].length; j++) {
                this.pheromoneMatrix[IterationResultList[i][j - 1]][IterationResultList[i][j]] += addPheromoneAmount
            }
        }
    }

    // 運行計算
    run() {
        for (let i = 0; i < this.MaxIterations; i++) { // 每個回合
            // 準備一個List，存儲每隻螞蟻的結果
            let currentIterationResultList = []
            for (let j = 0; j < this.ColonySize; j++) { // 每隻螞蟻
                // 紀錄當前螞蟻的走訪路徑
                let currentAntRouteResult = []
                // 紀錄當前所在的城市
                let currentCityID = 0
                // 紀錄候選城市List
                let currentCandidateCityIDList = [...this.cityIDList]

                // 雖機選擇起始城市
                let startCityIndex = Math.floor(Math.random() * currentCandidateCityIDList.length)
                currentCityID = currentCandidateCityIDList.splice(startCityIndex, 1)[0]
                currentAntRouteResult.push(currentCityID)

                for (let k = 1; k < this.cityLength; k++) { // 每個城市
                    // 機算前往每個候選城市的機率
                    let candidateCityProbabilityList = currentCandidateCityIDList.map(targetID =>
                        Math.pow(this.pheromoneMatrix[currentCityID][targetID], this.Alpha) * Math.pow(this.distanceMatrix[currentCityID][targetID], this.Beta)
                    )
                    // 前往下一個城市
                    const nextCityIndex = this.doRouletteWheelSelection(candidateCityProbabilityList)
                    currentCityID = currentCandidateCityIDList.splice(nextCityIndex, 1)[0]
                    currentAntRouteResult.push(currentCityID)
                }
                // 尾接頭行程一趟
                currentAntRouteResult.push(currentAntRouteResult[0])
                // 將當前螞蟻結果存入這回合結果清單
                currentIterationResultList.push(currentAntRouteResult)
            }
            // 更新費洛蒙舉矩陣
            this.updatePheromoneMatrix(currentIterationResultList)
        }
    }
};