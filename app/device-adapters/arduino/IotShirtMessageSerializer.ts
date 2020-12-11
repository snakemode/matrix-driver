import { SetPixelsMessage } from "../../messages/SetPixelsMessage";
import { Coord, LedMatrixConfiguration } from "../../types";

export class IotShirtMessageSerializer {

    private _defaultColor: string;
    private _config: LedMatrixConfiguration;

    constructor(config: LedMatrixConfiguration) {
        this._defaultColor = "#FFFFFF";
        this._config = config;
    }

    public serialize(message: SetPixelsMessage): Uint8Array[] {

        const serializedValues = [];

        for (let value of message.pixelValues) {

            const location = this.convertXyToIndex(value, this._config);

            const oneLine = `${location}${value.color ?? this._defaultColor}`;
            const asBinaryArray = Buffer.from(oneLine, "utf8");

            serializedValues.push(asBinaryArray);
        }

        return serializedValues;
    }

    convertXyToIndex(location: Coord, config: LedMatrixConfiguration) {
        const x = location.x;
        const y = location.y ?? 0;

        let index = x + (y * config.width);
        return index;
    }
}
