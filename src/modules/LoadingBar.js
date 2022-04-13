class LoadingBar {
    constructor() {
        this.loadingLineTag = document.getElementById('loadingLine')
        this.loadingPercentTag = document.getElementById('loadingPercent')
    }
    setPersent(newPercent){
        this.loadingPercentTag.innerHTML = newPercent
        this.loadingLineTag.style.width = `${newPercent}%`
    }
}
export default new LoadingBar()