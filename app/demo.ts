import { ArduinoSimulator } from "./Adruino/System/Simulator/ArduinoSimulator";
import { RemoteMatrixLedDriver } from './RemoteMatrixLedDriver';
import { CarriageReturnMode, IndexMode } from './types';
import { ArduinoDeviceAdapter } from "./device-adapters/arduino/ArduinoDeviceAdapter";
import { mqtt_connection } from "./Adruino/System/ArduinoLibraryClones/mqtt_connection";
import { Program } from "./Adruino/UserCode/PixelProtocolDisplayDriver/ArduinoProgram";
import { AblyTransport } from "./transports/AblyTransport";
import Ably from "ably";

ArduinoSimulator.runWithDisplay(new Program(), "lightGrid", {
    width: 32,
    height: 8,
    indexFrom: IndexMode.TopLeft,
    carriageReturnMode: CarriageReturnMode.Snaked
});

// Our client side code below here.
const ablyClient = new Ably.Realtime.Promise({ authUrl: '/api/createTokenRequest' });

const ledDriver = new RemoteMatrixLedDriver({
    displayConfig: { width: 32, height: 8 },
    deviceAdapter: new ArduinoDeviceAdapter([
        new AblyTransport(ablyClient),
        mqtt_connection.instance
    ])
});

//ledDriver.pixel.set({ x: 5, y: 5, color: "#FFFFFF" });
//ledDriver.pixel.set([{ x: 2, y: 2, color: "#FF0000" }, { x: 5, y: 2, color: "#FF0000" }]);

//ledDriver.text.scroll("The quick brown fox jumped over the lazy dog");

//ledDriver.pixel.set({ x: 0, y: 0 });

// ledDriver.pixel.set([{ x: 1, color: "#ff0000" }, { x: 2 }]);

// ledDriver.pixel.setAll([
//     "                                ",
//     "                                ",
//     "          #                     ",
//     "                                ",
//     "                         #      ",
//     "                                ",
//     "                                ",
//     "                                ",
// ], "#FFFFFF", true);

ledDriver.image.set("./test.png");


