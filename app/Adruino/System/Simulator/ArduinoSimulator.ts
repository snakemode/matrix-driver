import { IArduinoProgram } from "./IArduinoProgram";
import { delay } from "./ArduinoGlobals";
import { ILedStrip } from "../LedMatrixSimulator/ILedStrip";
import { Adafruit_NeoPixel } from "../ArduinoLibraryClones/Adafruit_NeoPixel";
import { VirtualMatrix } from "../LedMatrixSimulator/VirtualMatrix";
import { LedMatrixConfiguration } from "../../../types";

export class ArduinoSimulator {

    private _program: IArduinoProgram;
    private _requestCancellation: boolean;
    private _cancelled: boolean;

    constructor(program: IArduinoProgram) {
        this._program = program;
        this._requestCancellation = false;
        this._cancelled = false;
    }

    async execute(maxIterations: number = -1): Promise<void> {
        console.log("Executing fake Arduino code");

        this._requestCancellation = false;
        this._cancelled = false;

        await this._program.setup();

        let programCounter = 0;

        while (true) {
            if (this._requestCancellation) {
                this._cancelled = true;
                console.log("Stopping fake Arduino code");
                return;
            }

            await this._program.loop();
            await delay(1);

            programCounter++;

            if (maxIterations == -1) {
                continue;
            }

            if (maxIterations > -1 && programCounter >= maxIterations) {
                return;
            }
        }
    }

    async stop() {
        this._requestCancellation = true;
        while (!this._cancelled) {
            await delay(5);
        }
        this._requestCancellation = false;
        this._cancelled = false;
    }

    public static runWithDisplay(program: IArduinoProgram, displayTarget: HTMLElement | string, displayConfig: LedMatrixConfiguration) {
        const leds = new VirtualMatrix(displayTarget, displayConfig);
        ArduinoSimulator.run(program, leds);
    }

    public static run(program: IArduinoProgram, virtualLedMatrix: ILedStrip = null) {
        const sim = new ArduinoSimulator(program);

        if (virtualLedMatrix) {
            Adafruit_NeoPixel.setLedStrip(virtualLedMatrix);
        }

        sim.execute();
    }
}