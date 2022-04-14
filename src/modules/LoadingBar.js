class LoadingBar {
    constructor() {
        this.loadingBarTag = document.getElementById('loadingBar')
        this.loadingPercentBarTag = document.getElementById('loadingPercentBar')
        this.loadingLineTag = document.getElementById('loadingLine')
    }
    show(){
        this.loadingBarTag.style.display = 'block'
    }
    close(){
        this.loadingBarTag.style.display = 'none'
    }
    setPersent(newPercent){
        const copyPercentBarTag = this.loadingPercentBarTag.cloneNode()
        const copyLineTag = this.loadingLineTag.cloneNode()
        copyPercentBarTag.innerHTML = `<span id="loadingPercent">${newPercent}</span><span>%</span>`
        copyLineTag.style.width = `${newPercent}%`

        var fragment = document.createDocumentFragment();
        fragment.appendChild(copyPercentBarTag)
        fragment.appendChild(copyLineTag)

        this.loadingBarTag.removeChild(this.loadingPercentBarTag)
        this.loadingBarTag.removeChild(this.loadingLineTag)
        this.loadingBarTag.appendChild(fragment)

        this.loadingPercentBarTag = copyPercentBarTag
        this.loadingLineTag = copyLineTag
    }
}
export default new LoadingBar()