import { ValidProtocolMessage } from "./ValidProtocolMessage";

export interface IPixelProtocolSerializer<TMessageType extends ValidProtocolMessage> {
    serialize(message: TMessageType): Uint8Array;
    deserialize(bytes: Uint8Array): TMessageType;
}
