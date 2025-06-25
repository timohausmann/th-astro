// Standard interface for canvas effects
export interface CanvasEffect {
    init: (canvas: HTMLCanvasElement) => void;
    resize: (width: number, height: number) => void;
    loop: (deltaTime: number) => void;
    destroy: () => void;
}
