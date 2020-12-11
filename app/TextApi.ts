import { SetTextMessage, TextMode } from "./messages/SetTextMessage";
import { IRemoteMatrixLedDriverConfiguration, Rgb } from "./types";

export class TextApi {

    private _config: IRemoteMatrixLedDriverConfiguration;

    constructor(config: IRemoteMatrixLedDriverConfiguration) {
        this._config = config;
    }

    public async scroll(content: string, color: Rgb | string = "#ffffff", speedMs: number = 25) {
        const textMessage = new SetTextMessage(content, TextMode.scrollFromRight, speedMs, color);
        this._config.deviceAdapter.sendText(textMessage);
    }
}
