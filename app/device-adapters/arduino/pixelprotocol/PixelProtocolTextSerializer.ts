import { SetPixelsMessage } from "../../../messages/SetPixelsMessage";
import { IPixelProtocolSerializer } from "./IPixelProtocolSerializer";

export class PixelProtocolTextSerializer implements IPixelProtocolSerializer<SetPixelsMessage> {

    public serialize(message: SetPixelsMessage): Uint8Array {
        const serializedValues = [];

        for (let pixel of message.pixelValues) {
            const oneLine = `${pixel.x}-${pixel.y}${pixel.color}`;
            serializedValues.push(oneLine);
        }

        const singleMessage = "P:" + serializedValues.join(",");
        const asBinaryArray = Buffer.from(singleMessage, "utf8");

        return asBinaryArray;
    }
}
