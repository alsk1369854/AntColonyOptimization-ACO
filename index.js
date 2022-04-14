(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _CanvasUtil = require('./modules/CanvasUtil');

var _CanvasUtil2 = _interopRequireDefault(_CanvasUtil);

var _LoadingBar = require('./modules/LoadingBar');

var _LoadingBar2 = _interopRequireDefault(_LoadingBar);

var _ACO = require('./modules/ACO');

var _ACO2 = _interopRequireDefault(_ACO);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {

    // 最佳路程顯示標籤
    var bestDistanceValueTag = document.getElementById('bestDistanceValue');
    // 總城市數顯示標籤
    var totalCityValueTag = document.getElementById('totalCityValue');
    var cityAmount = 0;
    // 運行時間標籤
    var runTimeValueTage = document.getElementById('runTimeValue');
    // 存儲要走訪的城市
    var cityList = [];

    var updateTotalCityValue = function updateTotalCityValue() {
        cityAmount = cityList.length;
        totalCityValueTag.innerHTML = cityAmount;
    };

    // 綁定在畫布中的點擊事件
    _CanvasUtil2.default.getTag().addEventListener('mouseup', function (event) {
        // 在點擊的 x y 座標
        var x = event.offsetX,
            y = event.offsetY;
        // 將點擊座標加入 pointList 中

        cityList.push([x, y]);
        // 在畫布中劃出點擊點
        _CanvasUtil2.default.drawPoint(x, y);
        // 更新總城市數
        updateTotalCityValue();
    });

    // 綁定隨機位址點擊事件
    var randomPositionBtn = document.getElementById('randomPositionBtn');
    randomPositionBtn.addEventListener('click', function (event) {
        var randomPositionAmount = document.getElementById('randomPositionAmount').value;
        for (var i = 0; i < randomPositionAmount; i++) {
            // 隨機x y軸
            var x = Math.random() * (_CanvasUtil2.default.getWidth() - 1);
            var y = Math.random() * (_CanvasUtil2.default.getHeight() - 1);
            // 將點擊座標加入 pointList 中
            cityList.push([x, y]);
            // 在畫布中劃出點擊點
            _CanvasUtil2.default.drawPoint(x, y);
        }
        // 更新總城市數
        updateTotalCityValue();
    });

    // 綁定計算最點路徑按鈕點擊事件
    var calculateShortestPathBtn = document.getElementById('calculateShortestPathBtn');
    calculateShortestPathBtn.addEventListener('click', async function (event) {
        if (cityList.length <= 0) return;

        var aco = new _ACO2.default(cityList);
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
        await aco.run();

        // 獲取最終結果
        var bestRoute = aco.getBestRoute();
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

        var bestRouteLength = aco.getBestRouteLength();
        /**
         * 1226.3942916446954
         */

        var runTime = aco.getRunTime();
        /**
         * 1
         */

        // 劃出最佳路徑
        _CanvasUtil2.default.clearCanvas();
        for (var i = 1; i < bestRoute.length; i++) {
            var _bestRoute$i = bestRoute[i],
                x = _bestRoute$i[0],
                y = _bestRoute$i[1];

            _CanvasUtil2.default.drawLine(bestRoute[i - 1], bestRoute[i]);
            _CanvasUtil2.default.drawPoint(x, y);
        }
        bestDistanceValueTag.innerHTML = bestRouteLength.toFixed(2);
        runTimeValueTage.innerHTML = runTime;
    });

    // 綁定重置按鈕點擊事件
    var resetBtn = document.getElementById('resetBtn');
    resetBtn.addEventListener('click', function (event) {
        // 清空畫布
        _CanvasUtil2.default.clearCanvas();
        // 初始畫讀條
        _LoadingBar2.default.setPersent(0);
        // 清空已標記的點
        cityList = [];
        // 更新總城市數
        updateTotalCityValue();
        // 更新最佳路徑距離
        bestDistanceValueTag.innerHTML = 0;
        runTimeValueTage.innerHTML = 0;
    });
})();
},{"./modules/ACO":2,"./modules/CanvasUtil":3,"./modules/LoadingBar":4}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _LoadingBar = require('./LoadingBar');

var _LoadingBar2 = _interopRequireDefault(_LoadingBar);

var _CanvasUtil = require('./CanvasUtil');

var _CanvasUtil2 = _interopRequireDefault(_CanvasUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AOC = function () {
    function AOC(cityList) {
        _classCallCheck(this, AOC);

        this.cityList = [].concat(_toConsumableArray(cityList));
        this.cityLength = this.cityList.length;
        this.cityIDList = this.cityList.map(function (_, index) {
            return index;
        });

        // this.ColonySize = this.cityLength // 螞蟻數量 
        this.ColonySize = 30; // 螞蟻數量 
        this.MaxIterations = 200; // 最大回合數
        this.Alpha = 1; // 費洛蒙權重係數
        this.Beta = 3; // 城市距離權重係數 ( Beta > Alpha 結果較佳)
        this.Rho = 0.1; // 費洛蒙衰弱係數 New Pheromone *= ( 1 - Rho )
        this.InitialPheromone = 1; // 初始費洛蒙
        this.PheromoneDepositWeight = 1; // 費洛蒙重量

        // 城市距離矩陣
        this.distanceMatrix = [];

        // 城市能見度矩陣
        this.visibilityMatrix = [];

        // 費洛蒙矩陣
        this.pheromoneMatrix = [];

        // 存儲最佳路徑 
        this.bestRoute = [];
        this.bestRouteLength = Number.MAX_SAFE_INTEGER;

        // 存儲處理時間
        this.runTime = 0;

        // 距離矩陣與初始費洛蒙矩陣
        this.buildVisibilityMatrix(this.cityList);
        this.buildInitialPheromoneMatrix();
    }

    _createClass(AOC, [{
        key: 'getBestRoute',
        value: function getBestRoute() {
            var _this = this;

            return this.bestRoute.map(function (cityID) {
                return _this.cityList[cityID];
            });
        }
    }, {
        key: 'getBestRouteLength',
        value: function getBestRouteLength() {
            return this.bestRouteLength;
        }
    }, {
        key: 'getRunTime',
        value: function getRunTime() {
            return this.runTime;
        }
    }, {
        key: 'getRoute',
        value: function getRoute(routeIDList) {
            var _this2 = this;

            return routeIDList.map(function (cityID) {
                return _this2.cityList[cityID];
            });
        }

        // 機算兩城市間的距離

    }, {
        key: 'claculateTheDistanceBetweenTwoOption',
        value: function claculateTheDistanceBetweenTwoOption(positionOne, positionTwo) {
            var oneX = positionOne[0],
                oneY = positionOne[1];
            var twoX = positionTwo[0],
                twoY = positionTwo[1];

            return Math.sqrt(Math.pow(twoX - oneX, 2) + Math.pow(twoY - oneY, 2));
        }
        // 建立城市能見度矩陣

    }, {
        key: 'buildVisibilityMatrix',
        value: function buildVisibilityMatrix(cityList) {
            for (var i = 0; i < this.cityLength; i++) {
                this.distanceMatrix.push([]);
                this.visibilityMatrix.push([]);
                for (var j = 0; j < this.cityLength; j++) {
                    this.distanceMatrix[i].push(this.claculateTheDistanceBetweenTwoOption(cityList[i], cityList[j]));
                    this.visibilityMatrix[i].push(1 / this.distanceMatrix[i][j]);
                }
            }
        }

        // 建立初始費洛蒙矩陣

    }, {
        key: 'buildInitialPheromoneMatrix',
        value: function buildInitialPheromoneMatrix() {
            for (var i = 0; i < this.cityLength; i++) {
                this.pheromoneMatrix.push([]);
                for (var j = 0; j < this.cityLength; j++) {
                    this.pheromoneMatrix[i].push(this.InitialPheromone);
                }
            }
        }

        // 隨機輪盤法

    }, {
        key: 'doRouletteWheelSelection',
        value: function doRouletteWheelSelection(candidateCityProbabilityList) {
            // 所有機率之和
            var sumProbability = candidateCityProbabilityList.reduce(function (previusValue, currentValue) {
                return previusValue += currentValue;
            }, 0);
            // 每個地點的機率表(和為1)
            var probability = candidateCityProbabilityList.map(function (item) {
                return item / sumProbability;
            });
            // 開始輪盤法
            var randomNuber = Math.random();
            var sumProb = 0;
            for (var i = 0; i < probability.length; i++) {
                sumProb += probability[i];
                if (sumProb >= randomNuber) return i;
            }
        }

        // 更新費洛蒙居矩陣

    }, {
        key: 'updatePheromoneMatrix',
        value: async function updatePheromoneMatrix(IterationResultList) {
            // 費洛蒙衰退
            for (var i = 0; i < this.cityLength; i++) {
                for (var j = 0; j < this.cityLength; j++) {
                    this.pheromoneMatrix[i][j] *= 1 - this.Rho;
                }
            }
            // 增加回合路徑費洛蒙
            for (var _i = 0; _i < IterationResultList.length; _i++) {
                var routeLen = 0;
                for (var _j = 1; _j < IterationResultList[_i].length; _j++) {
                    routeLen += this.distanceMatrix[IterationResultList[_i][_j - 1]][IterationResultList[_i][_j]];
                }
                // 更新最短路徑
                if (routeLen < this.bestRouteLength) {
                    this.bestRoute = [].concat(_toConsumableArray(IterationResultList[_i]));
                    this.bestRouteLength = routeLen;

                    // Start 目前最佳路徑 (可刪)＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
                    var route = this.getBestRoute();
                    _CanvasUtil2.default.clearCanvas();
                    for (var _i2 = 1; _i2 < route.length; _i2++) {
                        var _route$_i = route[_i2],
                            x = _route$_i[0],
                            y = _route$_i[1];

                        _CanvasUtil2.default.drawLine(route[_i2 - 1], route[_i2]);
                        _CanvasUtil2.default.drawPoint(x, y);
                    }
                    await this.sleep(1);
                    // End 劃出當前路徑 (可刪)＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
                }
                // 螞蟻走過路徑費洛蒙
                var addPheromoneAmount = this.PheromoneDepositWeight / routeLen;
                for (var _j2 = 1; _j2 < IterationResultList[_i].length; _j2++) {
                    this.pheromoneMatrix[IterationResultList[_i][_j2 - 1]][IterationResultList[_i][_j2]] += addPheromoneAmount;
                }
            }
        }
    }, {
        key: 'sleep',
        value: function sleep(sleepTime) {
            return new Promise(function (r) {
                return setTimeout(r, sleepTime);
            });
        }

        // 運行計算

    }, {
        key: 'run',
        value: async function run() {
            var _this3 = this;

            // 初始化LoadingLine
            _LoadingBar2.default.setPersent(0);
            await this.sleep(1);
            // 初始化執行時間
            var startTime = new Date();

            for (var i = 0; i < this.MaxIterations; i++) {
                // 每個回合
                // 準備一個List，存儲每隻螞蟻的結果
                var currentIterationResultList = [];

                var _loop = function _loop(j) {
                    // 每隻螞蟻
                    // 紀錄當前螞蟻的走訪路徑
                    var currentAntRouteResult = [];
                    // 紀錄當前所在的城市
                    var currentCityID = 0;
                    // 紀錄候選城市List
                    var currentCandidateCityIDList = [].concat(_toConsumableArray(_this3.cityIDList));

                    // 雖機選擇起始城市
                    var startCityIndex = Math.floor(Math.random() * currentCandidateCityIDList.length);
                    currentCityID = currentCandidateCityIDList.splice(startCityIndex, 1)[0];
                    currentAntRouteResult.push(currentCityID);

                    for (var k = 1; k < _this3.cityLength; k++) {
                        // 每個城市
                        // 機算前往每個候選城市的機率
                        var candidateCityProbabilityList = currentCandidateCityIDList.map(function (targetID) {
                            return Math.pow(_this3.pheromoneMatrix[currentCityID][targetID], _this3.Alpha) * Math.pow(_this3.visibilityMatrix[currentCityID][targetID], _this3.Beta);
                        });
                        // 前往下一個城市
                        var nextCityIndex = _this3.doRouletteWheelSelection(candidateCityProbabilityList);
                        currentCityID = currentCandidateCityIDList.splice(nextCityIndex, 1)[0];
                        currentAntRouteResult.push(currentCityID);
                    }
                    // 尾接頭行程一趟
                    currentAntRouteResult.push(currentAntRouteResult[0]);
                    // 將當前螞蟻結果存入這回合結果清單
                    currentIterationResultList.push(currentAntRouteResult);
                };

                for (var j = 0; j < this.ColonySize; j++) {
                    _loop(j);
                }
                // 更新費洛蒙舉矩陣
                await this.updatePheromoneMatrix(currentIterationResultList);

                // 更新畫面LoadingLine
                _LoadingBar2.default.setPersent(Math.floor((i + 1) / this.MaxIterations * 100));
                await this.sleep(1);
            }

            var endTime = new Date();
            this.runTime = Math.round((endTime - startTime) / 1000);
        }
    }]);

    return AOC;
}();

exports.default = AOC;
;
},{"./CanvasUtil":3,"./LoadingBar":4}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CanvasUtil = function () {
    function CanvasUtil() {
        _classCallCheck(this, CanvasUtil);

        // 創建畫布操作工具
        this.canvasTag = document.getElementById('canvas');
        this.canvasTag.width = 450;
        this.canvasTag.height = 400;
        this.ctx = this.canvasTag.getContext('2d');
    }

    _createClass(CanvasUtil, [{
        key: 'getTag',
        value: function getTag() {
            return this.canvasTag;
        }
    }, {
        key: 'setWidth',
        value: function setWidth(newWidth) {
            this.canvasTag.width = newWidth;
        }
    }, {
        key: 'setHeight',
        value: function setHeight(newHeight) {
            this.canvasTag.height = newHeight;
        }
    }, {
        key: 'getWidth',
        value: function getWidth() {
            return this.canvasTag.width;
        }
    }, {
        key: 'getHeight',
        value: function getHeight() {
            return this.canvasTag.height;
        }
    }, {
        key: 'getContext2D',
        value: function getContext2D() {
            return this.ctx;
        }

        // 清空畫布

    }, {
        key: 'clearCanvas',
        value: function clearCanvas() {
            this.ctx.clearRect(0, 0, this.canvasTag.width, this.canvasTag.height);
        }

        // 畫點

    }, {
        key: 'drawPoint',
        value: function drawPoint(x, y) {

            this.ctx.fillStyle = "#455ac2";
            this.ctx.beginPath();
            this.ctx.arc(x, y, 4, 0, 2 * Math.PI);
            this.ctx.stroke();
            this.ctx.fill();
        }

        // 畫線

    }, {
        key: 'drawLine',
        value: function drawLine(startPosition, endPosition) {
            var startX = startPosition[0],
                startY = startPosition[1];
            var endX = endPosition[0],
                endY = endPosition[1];


            this.ctx.strokeStyle = "#4d5daa";
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(startX, startY);
            this.ctx.lineTo(endX, endY);
            this.ctx.stroke();
        }
    }]);

    return CanvasUtil;
}();

exports.default = new CanvasUtil();
},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LoadingBar = function () {
    function LoadingBar() {
        _classCallCheck(this, LoadingBar);

        this.loadingBarTag = document.getElementById('loadingBar');
        this.loadingPercentBarTag = document.getElementById('loadingPercentBar');
        this.loadingLineTag = document.getElementById('loadingLine');
    }

    _createClass(LoadingBar, [{
        key: 'show',
        value: function show() {
            this.loadingBarTag.style.display = 'block';
        }
    }, {
        key: 'close',
        value: function close() {
            this.loadingBarTag.style.display = 'none';
        }
    }, {
        key: 'setPersent',
        value: function setPersent(newPercent) {
            var copyPercentBarTag = this.loadingPercentBarTag.cloneNode();
            var copyLineTag = this.loadingLineTag.cloneNode();
            copyPercentBarTag.innerHTML = '<span id="loadingPercent">' + newPercent + '</span><span>%</span>';
            copyLineTag.style.width = newPercent + '%';

            var fragment = document.createDocumentFragment();
            fragment.appendChild(copyPercentBarTag);
            fragment.appendChild(copyLineTag);

            this.loadingBarTag.removeChild(this.loadingPercentBarTag);
            this.loadingBarTag.removeChild(this.loadingLineTag);
            this.loadingBarTag.appendChild(fragment);

            this.loadingPercentBarTag = copyPercentBarTag;
            this.loadingLineTag = copyLineTag;
        }
    }]);

    return LoadingBar;
}();

exports.default = new LoadingBar();
},{}]},{},[1]);
