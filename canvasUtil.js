class CanvasUtil {
    #canvasTag = null
    #ctx = null
    #width = 0;
    #height = 0;

    constructor(canvasTag) {
        this.#canvasTag = canvasTag;
        this.#ctx = this.#canvasTag.getContext('2d')
    }

    setWidth(newWidth) {
        this.#canvasTag.width = newWidth
        this.#width = newWidth
    }
    setheight(newHeight) {
        this.#canvasTag.height = newHeight
        this.#height = newHeight
    }
    getWidth() {
        return this.#width
    }
    // 清空畫布
    clearCanvas = () => {
        this.#ctx.clearRect(0, 0, this.#width, this.#height);
    }

    // 畫點
    drawPoint = (x, y) => {
        this.#ctx.beginPath();
        this.#ctx.arc(x, y, 2, 0, 2 * Math.PI)
        this.#ctx.stroke();
    }

    // 畫線
    drawLine = (startPosition, endPosition) => {
        const { [0]: startX, [1]: startY } = startPosition
        const { [0]: endX, [1]: endY } = endPosition
        // test ================
        // console.log('@drawLine: ', startX, startY)

        this.#ctx.moveTo(startX, startY)
        this.#ctx.lineTo(endX, endY)
        this.#ctx.stroke()
    }
}
