import { ResolvedPixelValue } from "../../../messages/ResolvedPixelValue";
import { SetPixelsMessage } from "../../../messages/SetPixelsMessage";
import { isCoord, isRgb } from "../../../types";
import { IPixelProtocolSerializer } from "./IPixelProtocolSerializer";
import { AsciiControlCodes } from "./AsciiControlCodes";
import { ColorConverter } from "../../../ColorConverter";

export class SetPixelSerializer implements IPixelProtocolSerializer<SetPixelsMessage> {

    public serialize(message: SetPixelsMessage): Uint8Array {
        // Binary control format for pixel mode to reduce string manip overhead on the IoT devices
        //
        // Example packet:
        //
        // 0x11, 0x50, 0x02, 255, 255, 255, 0, 0, 0x17, 0x02, 255, 255, 0, 1, 0, 0x03, 0x04
        // DC1 , "P" , STX , red, gre, blu, x, y, EOB , STX , Red, Gre, B, x, y, EOT , EoTrans
        // 
        // DC1 = Device Control 1
        // P = "Pixel mode",
        // STX = Start of transmission
        // R, G, B values
        // Any number of X, Y locations
        // EOB = end of pixel block
        // STX = subsequent pixel
        // R, G, B values
        // Any number of X, Y locations
        // (repeats, for every set of colors in data)
        // EOT = All pixel data complete
        // EOT = End of message
        const commands = this.asDrawSequence(message.pixelValues);

        const binaryCommands = [
            AsciiControlCodes.DeviceControl1,
            AsciiControlCodes.P_PixelMode
        ];

        for (let element of commands) {

            if (typeof element === "string") {
                const asRgb = ColorConverter.forceRgb(element);
                const lastCommand = binaryCommands[binaryCommands.length - 1];

                if (lastCommand != AsciiControlCodes.P_PixelMode) {

                    if (lastCommand == AsciiControlCodes.RS_RecordSeparator) {
                        binaryCommands.pop(); // Start of new section, remove RS.
                    }

                    binaryCommands.push(AsciiControlCodes.ETB_EndOfBlock);
                }

                binaryCommands.push(AsciiControlCodes.STX_StartOfText);
                binaryCommands.push(asRgb.r, asRgb.g, asRgb.b);
                continue;
            }

            if (isCoord(element)) {
                binaryCommands.push(element.x, element.y);
                binaryCommands.push(AsciiControlCodes.RS_RecordSeparator);
                continue;
            }
        }

        if (binaryCommands[binaryCommands.length - 1] == AsciiControlCodes.RS_RecordSeparator) {
            binaryCommands.pop(); // Last element, don't need this now.
        }

        binaryCommands.push(AsciiControlCodes.ETX_EndOfText);
        binaryCommands.push(AsciiControlCodes.EOT_EndOfTransmission);

        return new Uint8Array([...binaryCommands]);
    }

    public deserialize(bytes: Uint8Array): SetPixelsMessage {

        if (bytes[0] != AsciiControlCodes.DeviceControl1
            && bytes[1] != AsciiControlCodes.P_PixelMode) {
            throw new Error("Wrong message type for serializer.");
        }

        const pixels = [];

        let inPixelBlock = false;
        let r = 0;
        let g = 0;
        let b = 0;

        for (let i = 0; i < bytes.length; i++) {
            let current = bytes[i];

            if (inPixelBlock) {
                const x = current;
                const y = bytes[++i];

                const pixel = {
                    x, y, color: { r, g, b }
                };

                pixels.push(pixel);

                const next = bytes[i + 1];

                if (next !== AsciiControlCodes.RS_RecordSeparator) {
                    inPixelBlock = false;
                } else {
                    i++;
                }

                continue;
            }

            if (current == AsciiControlCodes.EOT_EndOfTransmission) {
                break;
            }

            if (current == AsciiControlCodes.ETB_EndOfBlock) {
                inPixelBlock = false;
                continue;
            }

            if (current === AsciiControlCodes.STX_StartOfText) {
                r = bytes[++i];
                g = bytes[++i];
                b = bytes[++i];
                inPixelBlock = true;
                continue;
            }
        }

        return SetPixelsMessage.fromPixelValueCollection(pixels);
    }

    private asDrawSequence(resolvedPixels: ResolvedPixelValue[]) {

        const grouped = groupBy(resolvedPixels, pixel => {
            if (isRgb(pixel.color)) {
                return `${pixel.color.r},${pixel.color.g},${pixel.color.b}`;
            }
            return pixel.color.toString();
        });

        const drawCommands = [];
        const pixelColours = Object.getOwnPropertyNames(grouped);
        pixelColours.forEach(color => drawCommands.push(color, ...grouped[color]));

        return drawCommands;
    }
}

export const groupBy = <T, K extends keyof any>(list: T[], getKey: (item: T) => K) =>
    list.reduce((previous, currentItem) => {
        const group = getKey(currentItem);

        if (!previous[group]) {
            previous[group] = [];
        }

        previous[group].push(currentItem);
        return previous;
    }, {} as Record<K, T[]>);
