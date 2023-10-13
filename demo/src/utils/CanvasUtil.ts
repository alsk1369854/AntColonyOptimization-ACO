export default class CnavasUtil {
  public static getCanvasElement(query: string): HTMLCanvasElement {
    const element: HTMLCanvasElement | null = document.querySelector(query);
    if (!element) throw new Error(`querySelector by ${query} is null`);
    return element;
  }

  public static clear(canvasElement: HTMLCanvasElement) {
    const ctx: CanvasRenderingContext2D = this.getContent2D(canvasElement);
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  }

  public static drawPoint(
    canvasElement: HTMLCanvasElement,
    x: number,
    y: number
  ) {
    const ctx: CanvasRenderingContext2D = this.getContent2D(canvasElement);
    ctx.strokeStyle = "#86a0e3";
    ctx.fillStyle = "#334f96";
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
  }

  public static drawLine(
    canvasElement: HTMLCanvasElement,
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ) {
    const ctx: CanvasRenderingContext2D = this.getContent2D(canvasElement);
    ctx.strokeStyle = "#86a0e3";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }

  private static getContent2D(
    canvasElement: HTMLCanvasElement
  ): CanvasRenderingContext2D {
    const ctx: CanvasRenderingContext2D | null = canvasElement.getContext("2d");
    if (!ctx)
      throw new Error(`elemnt: ${canvasElement} getContext("2d") is null`);
    return ctx;
  }
}
