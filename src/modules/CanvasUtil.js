class CanvasUtil {
    constructor() {
        // 創建畫布操作工具
        this.canvasTag = document.getElementById('canvas')
        this.canvasTag.width = 450
        this.canvasTag.height = 400
        this.ctx = this.canvasTag.getContext('2d')
    }

    getTag() {
        return this.canvasTag
    }
    setWidth(newWidth) {
        this.canvasTag.width = newWidth

    }
    setHeight(newHeight) {
        this.canvasTag.height = newHeight
    }
    getWidth() {
        return this.canvasTag.width
    }
    getHeight() {
        return this.canvasTag.height
    }
    getContext2D() {
        return this.ctx
    }
    // 清空畫布
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvasTag.width, this.canvasTag.height);
    }

    // 畫點
    drawPoint(x, y) {

        this.ctx.fillStyle = "#455ac2"
        this.ctx.beginPath();
        this.ctx.arc(x, y, 4, 0, 2 * Math.PI)
        this.ctx.stroke();
        this.ctx.fill();
    }

    // 畫線
    drawLine(startPosition, endPosition) {
        const { [0]: startX, [1]: startY } = startPosition
        const { [0]: endX, [1]: endY } = endPosition

        this.ctx.strokeStyle = "#4d5daa"
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY)
        this.ctx.lineTo(endX, endY)
        this.ctx.stroke()
    }
}

export default new CanvasUtil()