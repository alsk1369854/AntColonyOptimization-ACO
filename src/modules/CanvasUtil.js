export default class CanvasUtil {


    constructor(canvasTag) {
        this.canvasTag = canvasTag;
        this.ctx = this.canvasTag.getContext('2d')

        this.width = canvasTag.width;
        this.height = canvasTag.height;
    }

    setWidth(newWidth) {
        this.canvasTag.width = newWidth 
        this.width = newWidth
    }
    setHeight(newHeight) {
        this.canvasTag.height = newHeight 
        this.height = newHeight
    }
    getWidth() {
        return this.width
    }
    getHeight(){
        return this.height
    }
    getContext2D(){
        return this.ctx
    }
    // 清空畫布
    clearCanvas(){
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    // 畫點
    drawPoint(x, y){

        this.ctx.fillStyle = "#455ac2"
        this.ctx.beginPath();
        this.ctx.arc(x, y, 4, 0, 2 * Math.PI)
        this.ctx.stroke();
        this.ctx.fill();
    }

    // 畫線
    drawLine(startPosition, endPosition){
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
