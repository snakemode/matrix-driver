import { ControlMessage, ControlMessageType } from "../../../messages/ControlMessage";
import { AsciiControlCodes } from "./AsciiControlCodes";
import { IPixelProtocolSerializer } from "./IPixelProtocolSerializer";

export class ControlMessageSerializer implements IPixelProtocolSerializer<ControlMessage> {

    public serialize(message: ControlMessage): Uint8Array {

        const binaryCommands: number[] = [
            AsciiControlCodes.DeviceControl1,
            AsciiControlCodes.C_ControlMessage,
            AsciiControlCodes.STX_StartOfText,
            message.type,
            AsciiControlCodes.ETX_EndOfText,
            AsciiControlCodes.EOT_EndOfTransmission
        ];

        return new Uint8Array(binaryCommands);
    }

    public deserialize(bytes: Uint8Array): ControlMessage {
        const type = bytes[3] as ControlMessageType;
        return new ControlMessage(type);
    }

}
