import { AsciiControlCodes } from "./AsciiControlCodes";
import { ControlMessageSerializer } from "./ControlMessageSerializer";
import { IPixelProtocolSerializer } from "./IPixelProtocolSerializer";
import { SetPixelSerializer } from "./SetPixelSerializer";
import { SetTextMessageSerializer } from "./SetTextMessageSerializer";
import { ValidProtocolMessage } from "./ValidProtocolMessage";

export class PixelProtocolSerializer implements IPixelProtocolSerializer<ValidProtocolMessage> {

    private _serializers: Map<String, IPixelProtocolSerializer<ValidProtocolMessage>>;

    constructor() {
        this._serializers = new Map<String, IPixelProtocolSerializer<ValidProtocolMessage>>();
        this._serializers.set("SetPixelsMessage", new SetPixelSerializer());
        this._serializers.set("SetTextMessage", new SetTextMessageSerializer());
        this._serializers.set("ControlMessage", new ControlMessageSerializer());
    }

    public serialize(message: ValidProtocolMessage): Uint8Array {
        const serializer = this._serializers.get(message.constructor.name);
        return serializer.serialize(message);
    }

    public deserialize(binary: Uint8Array): ValidProtocolMessage {

        if (binary[0] !== AsciiControlCodes.DeviceControl1) {
            throw new Error("Message not supported, must be DeviceControl1");
        }

        if (binary[1] === AsciiControlCodes.P_PixelMode) {
            const serializer = this._serializers.get("SetPixelsMessage") as SetPixelSerializer;
            return serializer.deserialize(binary);
        }

        throw new Error("Only SetPixelMessage supported at this time.");
    }
}