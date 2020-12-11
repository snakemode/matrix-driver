import { IRemoteMatrixLedDriverConfiguration } from "./types";
import { PixelApi } from "./PixelApi";
import { TextApi } from "./TextApi";
import { ImageApi } from "./ImageApi";

export class RemoteMatrixLedDriver {

    public get pixel() { return this._pixelApi; }
    public get text() { return this._textApi; }
    public get image() { return this._imageApi; }

    private _pixelApi: PixelApi;
    private _textApi: TextApi;
    private _imageApi: ImageApi;

    constructor(configuration: IRemoteMatrixLedDriverConfiguration) {
        this._pixelApi = new PixelApi(configuration);
        this._textApi = new TextApi(configuration);
        this._imageApi = new ImageApi(configuration);
    }
}