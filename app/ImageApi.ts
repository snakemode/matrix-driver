import { SetPixelsMessage } from "./messages/SetPixelsMessage";
import { IRemoteMatrixLedDriverConfiguration, PixelValue, Rgb } from "./types";

// import Jimp from 'jimp';
import Jimp from 'jimp/browser/lib/jimp'; // For browser support.
import { ColorConverter } from "./ColorConverter";

export class ImageApi {

    private _config: IRemoteMatrixLedDriverConfiguration;

    constructor(config: IRemoteMatrixLedDriverConfiguration) {
        this._config = config;
    }

    public async set(path: string) {
        const values: PixelValue[] = [];

        const image = await Jimp.read(path);
        await image.resize(this._config.displayConfig.width, this._config.displayConfig.height, Jimp.RESIZE_BILINEAR);


        for (let y = 0; y < image.getHeight(); y++) {
            for (let x = 0; x < image.getWidth(); x++) {
                const colour = image.getPixelColor(x, y);
                const asRGBA = Jimp.intToRGBA(colour);
                const asHex = ColorConverter.forceHex(asRGBA);
                values.push({ x, y, color: asHex });
            }
        }

        const message = SetPixelsMessage.fromPixelValueCollection(values);
        this._config.deviceAdapter.sendPixels(message);
    }
}