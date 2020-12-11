import { NEO_GRB, NEO_KHZ800 } from "../../System/ArduinoLibraryClones/Adafruit_NeoPixel";
import { mqtt_connection } from "../../System/ArduinoLibraryClones/mqtt_connection";
import { delay, Serial } from "../../System/Simulator/ArduinoGlobals";
import { IArduinoProgram } from "../../System/Simulator/IArduinoProgram";
import { message_processor } from "./message_processor";
import { SnakeLights } from "./snake_lights";
import { configuration, index_mode, carriage_return_mode } from "./DataStructures";
import { networking } from "./networking";

const PIN = 4;
let interval = 10;

const cfg: configuration = {
    wifi: { ssid: "ssid", password: "password" },
    mqtt: { server: "mqtt.ably.io", port: 8883, user: "api_key_part1", password: "api_key_part2", certificate: "cd bd 99 20 90 9d 5f 69 e5 76 6a b0 d1 20 de 33 c2 43 30 6e", subscription: "leds" },
    display: { width: 32, height: 8, indexMode: index_mode.TOP_LEFT, carriageReturnMode: carriage_return_mode.SNAKED, gpioPin: PIN, pixelType: NEO_GRB + NEO_KHZ800 }
};

const snakeLights = new SnakeLights(cfg);
const mqtt = new mqtt_connection(cfg);
const processor = new message_processor(cfg, mqtt, snakeLights);

export class Program implements IArduinoProgram {

    async setup(): Promise<void> {  
        Serial.begin(115200);
        delay(1000);

        await snakeLights.init();

        snakeLights.set_status_pixel(255, 0, 0);
        Serial.println("Testing WiFi connection...");

        await networking.ensure_wifi_connected(cfg.wifi.ssid, cfg.wifi.password);

        snakeLights.set_status_pixel(53, 153, 0);
        Serial.println("Testing MQTT connection...");

        mqtt.ensure_mqtt_connected(this.process);

        Serial.println("Device is now ready.");
        snakeLights.set_status_pixel(0, 255, 0);
        await delay(1000); // So we can *see* the green light! - not really needed in sim.

        snakeLights.clear();
    }

    async loop(): Promise<void> {
        // await snakeLights.testPattern();
        // await delay(2000);

        await networking.ensure_wifi_connected(cfg.wifi.ssid, cfg.wifi.password);
        mqtt.ensure_mqtt_connected(this.process);
        await mqtt.process_messages();

        await delay(interval);
    }

    async process(client: any, topic: string, payload: number[], payload_length: number) {
        await processor.process(payload, payload_length);
    }
}