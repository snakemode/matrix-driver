import { SetPixelsMessage } from "../messages/SetPixelsMessage";
import { ControlMessage } from "../messages/ControlMessage";
import { SetTextMessage } from "../messages/SetTextMessage";
import { IDeviceAdapter } from "./IDeviceAdapter";
import { DisplayBuffer } from "../text/DisplayBuffer";
import { TextEngine } from "../text/TextEngine";
import { PixelMap } from "../PixelMap";
import { PixelApi } from "../PixelApi";
import { IRemoteMatrixLedDriverConfiguration, Rgb } from "../types";

export class EmIngMaskDeviceAdapter implements IDeviceAdapter {
   
    private _config: IRemoteMatrixLedDriverConfiguration;
    private _pixels: PixelApi;
    private _textEngine: TextEngine;
    private _autoBuffer: DisplayBuffer;

    constructor(configuration: IRemoteMatrixLedDriverConfiguration, pixelApi: PixelApi) {
        this._config = configuration;
        this._pixels = pixelApi;

        this._autoBuffer = new DisplayBuffer(null, configuration.displayConfig);
        this._autoBuffer.onViewportUpdated(async (snapshot, diff, finished) => {
            await this.setDiff(diff, "#FFFFFF");
        });

        this._autoBuffer.autoScroll(30, true);
    }

    public sendPixels(payload: SetPixelsMessage): void {
        throw new Error('Method not implemented.');
    }

    public async sendText(payload: SetTextMessage): Promise<void> {
        this._autoBuffer.scrollSpeed = payload.scrollSpeedMs;
        const toDisplayPixels = await this._textEngine.rasterize(payload.value);
        this._autoBuffer.push(toDisplayPixels);
    }

    public sendControlMessage(payload: ControlMessage): void {
        throw new Error('Method not implemented.');
    }

    public async scroll(content: string, color: Rgb | string = "#fff000", speedMs: number = 250) {
        this._autoBuffer.scrollSpeed = speedMs;
        const toDisplayPixels = await this._textEngine.rasterize(content);
        this._autoBuffer.push(toDisplayPixels);
    }

    public async setDiff(diff: string[], color: Rgb | string) {
        const addCoords = [];
        const removeCoords = [];

        for (let item of PixelMap.itemsIn(diff)) {
            if (item.data === "+") {
                addCoords.push({ ...item, color });
            }

            if (item.data === "-") {
                removeCoords.push({ ...item, color: "#000000" });
            }
        }

        const allPixels = [...addCoords, ...removeCoords];

        if (allPixels.length > 0) {
            await this._pixels.set(allPixels);
        }
    }

    private async textToBuffer(content: string, color: Rgb | string) {
        const toDisplayPixels = await this._textEngine.rasterize(content);
        return new DisplayBuffer(toDisplayPixels, this._config.displayConfig);
    }
}
