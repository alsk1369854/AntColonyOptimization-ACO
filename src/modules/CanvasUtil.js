
/**
 * @description 畫布操作工具
 * @author alsk1369854@gmail.com
 */
class CanvasUtil {
    constructor() {
        // 創建畫布操作工具
        this.canvasTag = document.getElementById('canvas')
        if (window.screen.width <= 450) { // phone
            this.canvasTag.width = Math.floor(window.screen.width * 0.95)
            this.canvasTag.height = Math.floor(window.screen.width * 0.95)
        } else if (window.screen.width <= 900) { // ipad
            this.canvasTag.width = Math.floor(window.screen.width * 0.85)
            this.canvasTag.height = Math.floor(window.screen.width * 0.85)
        } else { // PC
            this.canvasTag.width = 800
            this.canvasTag.height = 400
        }


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
        this.ctx.strokeStyle = "#86a0e3"
        this.ctx.fillStyle = "#334f96"
        this.ctx.beginPath();
        this.ctx.arc(x, y, 7, 0, 2 * Math.PI)
        this.ctx.stroke();
        this.ctx.fill();
    }

    // 畫線
    drawLine(startPosition, endPosition) {
        const { [0]: startX, [1]: startY } = startPosition
        const { [0]: endX, [1]: endY } = endPosition
        this.ctx.strokeStyle = "#86a0e3"
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY)
        this.ctx.lineTo(endX, endY)
        this.ctx.stroke()
    }
}

export default new CanvasUtil()