import { delay } from "../../System/Simulator/ArduinoGlobals";

export class networking {
    public static async ensure_wifi_connected(ssid: string, password: string) {
        await delay(250);
    }
}