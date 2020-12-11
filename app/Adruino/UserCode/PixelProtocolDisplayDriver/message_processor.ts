import { mqtt_connection } from "../../System/ArduinoLibraryClones/mqtt_connection";
import { delay, F, Serial } from "../../System/Simulator/ArduinoGlobals";
import { configuration } from "./DataStructures";
import { search_utils } from "./search_utils";
import { SnakeLights } from "./snake_lights";
import { sprite_sheet } from "./sprite_sheet";

const DeviceControl1 = 0x11;
const STX_StartOfText = 0x02;
const ETB_EndOfBlock = 0x17;
const ETX_EndOfText = 0x03;
const EOT_EndOfTransmission = 0x04;
const C_ControlMessage = 0x43;
const P_PixelMode = 0x50;  
const S_ScrollMode = 0x53;
const T_TextMode = 0x54;
const RS_RecordSeparator = 0x1E;
const Empty = "";

export class message_processor {
    private cfg_: configuration;
    private mqtt_: mqtt_connection;
    private lights_: SnakeLights;

    constructor(c: any, mqtt: mqtt_connection, lights: SnakeLights) {
        this.cfg_ = c;
        this.mqtt_ = mqtt;
        this.lights_ = lights;
    }

    async process(bytes: number[], length: number) {
        if (length == 0)
            return;

        const controlCode = bytes[0];

        if (controlCode !== DeviceControl1)
        {
            Serial.println("Not a device control command.");
            return;
        }

        const controlMode = bytes[1];

        Serial.println("Device Control 1 Message received. Mode is:");
        Serial.println(controlMode);

        switch (controlMode) {
            case P_PixelMode:
                this.processSetPixelsMessage(bytes, length);
                return;
            case C_ControlMessage:
                this.processControlMessage(bytes, length);
                return;
            case T_TextMode:
                await this.processSetTextMessage(bytes, length);
                return;
        }
    }

    processSetPixelsMessage(bytes: number[], length: number) {
        Serial.println(F("processSetPixelsMessage"));

        let inPixelBlock = false;
        let r = 0;
        let g = 0;
        let b = 0;

        for (let i = 0; i < length; i++) {
            let current = bytes[i];

            if (inPixelBlock) {
                const x = current;                
                const y = bytes[++i];

                this.lights_.update_pixel_by_coord(x, y, r, g, b, false);

                const next = bytes[i + 1];

                if (next !== RS_RecordSeparator) {
                    inPixelBlock = false;
                } else {
                    i++;
                }

                continue;
            }

            if (current == EOT_EndOfTransmission) {
                break;
            }

            if (current == ETB_EndOfBlock) {
                inPixelBlock = false;
                continue;
            }

            if (current === STX_StartOfText) {
                r = bytes[++i];
                g = bytes[++i];
                b = bytes[++i];
                inPixelBlock = true;
                continue;
            }
        }

        this.lights_.flush();
    }
    
    processControlMessage(bytes: number[], length: number) {
        Serial.println(F("processControlMessage"));

        const controlMessageType = bytes[3];

        if (controlMessageType == 0) {
            this.lights_.clear();
        }
    }

    async processSetTextMessage(bytes: number[], length: number) {
        const messageModeByte = bytes[2];            
        const scrollSpeedMs = bytes[3];
        const r = bytes[4];
        const g = bytes[5];
        const b = bytes[6];

        const shouldScroll = messageModeByte == 1;

        this.printTextMessage(bytes, length);

        if (shouldScroll) {
            Serial.println(F("Scrolling enabled."));

            const maxWidthOffLeft = sprite_sheet.getTotalWidthOfText(bytes, length) * -1;

            let scrollPosition = this.cfg_.display.width;
            while (scrollPosition > maxWidthOffLeft) {

                this.lights_.clearWithoutFlush();
                this.drawEntireString(bytes, length, scrollPosition, r, g, b);

                scrollPosition--;

                await delay(scrollSpeedMs);
            }

        } else {
            Serial.println(F("Scrolling disabled."));
            this.drawEntireString(bytes, length, 0, r, g, b);
        }
    }

    drawEntireString(bytes: number[], length: number, shiftXpositionBy: number, r: number, g: number, b: number) {

        const textStart = bytes.indexOf(STX_StartOfText) + 1;
        const footerLength = 2;
        const spaceWidth = 1;

        let xPosition = shiftXpositionBy;

        for (let i = textStart; i < length - footerLength; i++) {

            const asciiCode = bytes[i];
            const spriteAndWidth = sprite_sheet.spriteDataFor(asciiCode);

            this.drawSpriteAtPosition(spriteAndWidth.spriteData, spriteAndWidth.width, xPosition, r, g, b);

            xPosition += spriteAndWidth.width + spaceWidth;
        }

        this.lights_.flush();
    }

    drawSpriteAtPosition(sprite: number[], width: number, xOffset: number, r: number, g: number, b: number) {

        let bytePosition = 0;

        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < width; x++) {

                const value = sprite[bytePosition++];
                const alignedX = x + xOffset;

                if (value === 1) {
                    this.lights_.update_pixel_by_coord(alignedX, y, r, g, b, false);
                }
            }
        }
    }

    printTextMessage(bytes: number[], length: number) {
        const textStart = search_utils.indexOf(bytes, length, STX_StartOfText) + 1;
        const textEnd = search_utils.indexOf(bytes, length, ETX_EndOfText);

        Serial.println("processSetTextMessage is:");

        for (let i = textStart; i < textEnd; i++) {
            let character = bytes[i];
            Serial.print(character);
      }

        Serial.println("");
    }
    

}