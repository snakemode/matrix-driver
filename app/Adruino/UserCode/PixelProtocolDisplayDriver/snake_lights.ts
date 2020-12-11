import { Adafruit_NeoPixel } from "../../System/ArduinoLibraryClones/Adafruit_NeoPixel";
import { F, Serial } from "../../System/Simulator/ArduinoGlobals";
import { carriage_return_mode, configuration, displayConfiguration, index_mode } from "./DataStructures";

const strip_ = new Adafruit_NeoPixel();

export class SnakeLights {
    private cfg_: configuration;
    private NUM_LIGHTS: number;
    private WIDTH: number;
    private HEIGHT: number;

    constructor(c: configuration) {
        this.cfg_ = c;
        this.NUM_LIGHTS = c.display.width * c.display.height;
        this.WIDTH = c.display.width;
        this.HEIGHT = c.display.height;
    }

    async init() {
        Serial.println("Init Adafruit_NeoPixel...");
        strip_.updateLength(this.NUM_LIGHTS);
        strip_.updateType(this.cfg_.display.pixelType);
        strip_.setPin(this.cfg_.display.gpioPin);
        Serial.println("Done.");

        strip_.begin();

        // Top left set to red while booting.
        strip_.setPixelColor(0, Adafruit_NeoPixel.Color(255, 0, 0));
        for (let i = 1; i < this.NUM_LIGHTS; i++) {
            strip_.setPixelColor(i, Adafruit_NeoPixel.Color(0, 0, 0));
        }

        await strip_.show();
    }

    set_status_pixel(r, g, b) {
        this.clearWithoutFlush();
        strip_.setPixelColor(0, Adafruit_NeoPixel.Color(r, g, b));
        strip_.show();
    }

    clearWithoutFlush() {
        for (let i = 0; i < this.NUM_LIGHTS; i++) {
            strip_.setPixelColor(i, Adafruit_NeoPixel.Color(0, 0, 0));
        }
    }

    async clear() {
        this.clearWithoutFlush();
        await strip_.show();
    }

    async testPattern() {
        for (let y = 0; y < this.HEIGHT; y++) {
            for (let x = 0; x < this.WIDTH; x++) {
                await this.update_pixel_by_coord(x, y, 255, 255, 255, true);
            }
        }
    }

    log(pixel, r, g, b) {
        Serial.println(F("Updating lights."));
        Serial.print(pixel);
        Serial.print(F(":("));
        Serial.print(r);
        Serial.print(F(","));
        Serial.print(g);
        Serial.print(F(","));
        Serial.print(b);
        Serial.print(F(")\r\n"));
    }
    
    async update_pixel_by_coord(x: number, y: number, r: number, g: number, b: number, autoFlush: boolean) {
        if (x >= this.WIDTH || y >= this.HEIGHT) {
            return;
        } 
        
        if (x < 0 || y < 0) {
            return;
        }

        const adjusted = SnakeLights.adjustXYToMatchDisplay(x, y, this.cfg_.display);
        let pixel_number = adjusted.pixel_number;

        strip_.setPixelColor(pixel_number, r, g, b);

        if (autoFlush) {
            await strip_.show();
        }
    }

    public static adjustXYToMatchDisplay(x: number, y: number, config: displayConfiguration) {
        let adjustedX = x;
        let adjustedY = y;

        if (config.indexMode == index_mode.TOP_LEFT) {
            adjustedX = x;
        } else if (config.indexMode == index_mode.TOP_RIGHT) {
            adjustedX = ((config.width - 1) - x);
        } else if (config.indexMode == index_mode.BOTTOM_LEFT) {
            adjustedY = ((config.height - 1) - y);
        } else if (config.indexMode == index_mode.BOTTOM_RIGHT) {
            adjustedX = ((config.width - 1) - x);
            adjustedY = ((config.height - 1) - y);
        }

        if (config.carriageReturnMode == carriage_return_mode.REGULAR) {
            const pixel_number = adjustedX + (adjustedY * config.width);
            return { x: adjustedX, y: adjustedY, pixel_number: pixel_number };
        }

        if (config.carriageReturnMode == carriage_return_mode.SNAKED) {
            const shouldSnakeX = Math.floor(adjustedY % 2) == 1;

            if (shouldSnakeX) {
                adjustedX = ((config.width - 1) - adjustedX);
            }

            const pixel_number = adjustedX + (adjustedY * config.width);
            return { x: adjustedX, y: adjustedY, pixel_number: pixel_number };
        }

        if (config.carriageReturnMode == carriage_return_mode.SNAKED_VERTICALLY) {
            const shouldSnakeY = Math.floor(adjustedX % 2) == 1;

            if (shouldSnakeY) {
                adjustedY = ((config.height - 1) - adjustedY);
            }

            const pixel_number = adjustedY + (adjustedX * config.height);
            return { x: adjustedX, y: adjustedY, pixel_number: pixel_number };
        }

        return { x: -1, y: -1, pixel_number: -1 };
    }

    async flush() {
        await strip_.show();
    }
}