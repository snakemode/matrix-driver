import { SetPixelsMessage } from "../../messages/SetPixelsMessage";
import { ControlMessage } from "../../messages/ControlMessage";
import { SetTextMessage } from "../../messages/SetTextMessage";
import { IMessageTransport, } from "../../types";
import { IDeviceAdapter } from "../IDeviceAdapter";
import { PixelProtocolSerializer } from "./pixelprotocol/PixelProtocolSerializer";
import { IPixelProtocolSerializer } from "./pixelprotocol/IPixelProtocolSerializer";
import { ValidProtocolMessage } from "./pixelprotocol/ValidProtocolMessage";

// The Arduino adapter is a very light facade as most of the
// work is done in the serializers and selected transport
// It just provides a nicer more legible API to call.
export class ArduinoDeviceAdapter implements IDeviceAdapter {

    private _transports: IMessageTransport[];
    private _serializer: IPixelProtocolSerializer<ValidProtocolMessage>;

    constructor(transport: IMessageTransport | IMessageTransport[], serializer: IPixelProtocolSerializer<ValidProtocolMessage> = new PixelProtocolSerializer()) {
        this._transports = Array.isArray(transport) ? transport : [transport];
        this._serializer = serializer;
    }

    public sendPixels(payload: SetPixelsMessage): void {
        const message = this._serializer.serialize(payload);
        this._transports.forEach(t => t.send(message));
    }

    public sendText(payload: SetTextMessage): void {
        const message = this._serializer.serialize(payload);
        this._transports.forEach(t => t.send(message));
    }

    public sendControlMessage(payload: ControlMessage): void {
        const message = this._serializer.serialize(payload);
        this._transports.forEach(t => t.send(message));
    }
}
