import { SetTextMessage } from "../../../messages/SetTextMessage";
import { AsciiControlCodes } from "./AsciiControlCodes";
import { IPixelProtocolSerializer } from "./IPixelProtocolSerializer";

export class SetTextMessageSerializer implements IPixelProtocolSerializer<SetTextMessage> {

    public serialize(message: SetTextMessage): Uint8Array {
        const binaryCommands = [
            AsciiControlCodes.DeviceControl1,
            AsciiControlCodes.T_TextMode,
            message.mode
        ];

        binaryCommands.push(message.scrollSpeedMs);

        binaryCommands.push(
            message.color.r,
            message.color.g,
            message.color.b
        );

        binaryCommands.push(AsciiControlCodes.STX_StartOfText);

        for (let character of message.value) {
            binaryCommands.push(character.charCodeAt(0));
        }

        binaryCommands.push(
            AsciiControlCodes.ETX_EndOfText,
            AsciiControlCodes.EOT_EndOfTransmission
        );

        return new Uint8Array(binaryCommands);
    }
}