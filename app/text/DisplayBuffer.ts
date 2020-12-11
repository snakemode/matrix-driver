import { RemoteDisplayConfiguration } from "../types";
import { BufferDiffer } from "./BufferDiffer";

export type ViewportUpdatedCallback = (viewableArea: string[], diff: string[], finished: boolean) => void;

export class DisplayBuffer {

    public get width() { return this._buffer[0].length; }
    public get position() { return this._position; }
    public scrollSpeed: number = 250;

    private _buffer: string[];
    private _position: number;
    private _ledConfig: RemoteDisplayConfiguration;
    private _viewportUpdatedCallback: ViewportUpdatedCallback;

    constructor(contents: string[] = [], ledConfig: RemoteDisplayConfiguration) {
        this._position = 0;
        this._ledConfig = ledConfig;
        this._buffer = defaultBuffer(ledConfig);
        this._viewportUpdatedCallback = () => { };

        contents = contents || defaultBuffer(this._ledConfig);
        this.push(contents);
    }

    public clear() {
        this._buffer = defaultBuffer(this._ledConfig);
    }

    public push(content: string[]) {
        if (content.length > this._ledConfig.height) {
            return;
        }

        for (let y in content) {
            this._buffer[y] += content[y];
        }
    }

    public scrollViewport(distance: number = 1) {
        const preScrollSnapshot = this.visibleArea;
        this._position += distance;

        const diff = BufferDiffer.createDelta(preScrollSnapshot, this.visibleArea);
        this._viewportUpdatedCallback(this.visibleArea, diff, this._position > this.width);
    }

    public onViewportUpdated(callback: ViewportUpdatedCallback) {
        this._viewportUpdatedCallback = callback;
    }

    public async autoScroll(speedMs: number, forever: boolean = false) {
        this.scrollSpeed = speedMs;

        const timer = setInterval(() => {
            if (!this.hasAnyCharacters()) {
                return;
            }

            this.scrollViewport();

            if (this._position >= this.width) {
                this._buffer = defaultBuffer(this._ledConfig);
                this._position = 0;
            }

            if (!forever) {
                if (this._position >= this.width) {
                    clearInterval(timer);
                }
            }
        }, this.scrollSpeed);
    }

    private hasAnyCharacters(): boolean {
        for (let row in this._buffer) {
            if (row.trim() !== "") {
                return true;
            }
        }
        return false;
    }

    public get visibleArea(): string[] {
        const visibleArea: string[] = [];

        for (let row of this._buffer) {
            const sub = row.slice(this._position, this._position + this._ledConfig.width);
            visibleArea.push(sub);
        }

        return visibleArea;
    }
}

const defaultBuffer = (ledConfig: RemoteDisplayConfiguration) => {
    const buffer = new Array(ledConfig.height);
    for (let y = 0; y < ledConfig.height; y++) {
        buffer[y] = " ".repeat(ledConfig.width);
    }
    return buffer;
};