import { ControlMessage } from "../../../messages/ControlMessage";
import { SetPixelsMessage } from "../../../messages/SetPixelsMessage";
import { SetTextMessage } from "../../../messages/SetTextMessage";

export type ValidProtocolMessage = SetPixelsMessage | SetTextMessage | ControlMessage;

export function isSetPixelsMessage(object: any): object is SetPixelsMessage {
    return (object as SetPixelsMessage).palette !== undefined
        && (object as SetPixelsMessage).pixelValues !== undefined;
}

export function isSetTextMessage(object: any): object is SetTextMessage {
    return (object as SetTextMessage).value !== undefined;
}


export function isControlMessage(object: any): object is ControlMessage {
    return (object as ControlMessage).type !== undefined;
}