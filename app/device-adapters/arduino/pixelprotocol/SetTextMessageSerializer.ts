import { SetTextMessage, TextMode } from "../../../messages/SetTextMessage";
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

    public deserialize(data: Uint8Array): SetTextMessage {

        const bytes = [...data];
        const textBytes = bytes.slice(8, bytes.length - 2);

        let text = "";
        for (let charCode of textBytes) {
            text += String.fromCharCode(charCode);
        }

        const textMode = data[2] as TextMode;
        const speed = data[3];
        const color = {
            r: data[4],
            g: data[5],
            b: data[6]
        };

        return new SetTextMessage(text, textMode, speed, color);
    }
}