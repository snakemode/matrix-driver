import { SetPixelsMessage } from "../messages/SetPixelsMessage";
import { ControlMessage } from "../messages/ControlMessage";
import { SetTextMessage } from "../messages/SetTextMessage";


export interface IDeviceAdapter {
    sendPixels(payload: SetPixelsMessage): void;
    sendText(payload: SetTextMessage): void;
    sendControlMessage(payload: ControlMessage): void;
}
