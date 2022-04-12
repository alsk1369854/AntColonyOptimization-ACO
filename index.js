

(()=>{
    const canvasTag = document.getElementById('canvas')
    const canvas = new CanvasUtil(canvasTag)

    canvasTag.addEventListener('mouseup', event => {
        // // test ==============
        // console.log('X: '+ event.offsetX,'; Y: ' + event.offsetY)
        // console.log(event)

        // 在點擊的 x y 座標
        const { offsetX: x, offsetY: y } = event

        // 將點擊座標加入 pointList 中
        // pointList.push([x, y])

        // 在畫布中劃出點擊點
        drawPoint(ctx, x, y)
    })
})()