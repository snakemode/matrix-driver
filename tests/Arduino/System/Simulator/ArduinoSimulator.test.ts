import { delay } from "../../../../app/Adruino/System/Simulator/ArduinoGlobals";
import { ArduinoSimulator } from "../../../../app/Adruino/System/Simulator/ArduinoSimulator";

describe("Simulator", () => {

    it("execute, given valid program, calls setup", async () => {

        const program = {
            setupCalled: false,
            setup: async function () {
                this.setupCalled = true;
            },
            loop: async () => { }
        };

        const sut = new ArduinoSimulator(program);

        sut.execute();
        await sut.stop();

        expect(program.setupCalled).toBeTruthy();
    });

    it("execute, given valid program, calls loop at least once", async () => {

        const program = {
            loopCalled: false,
            setup: async () => { },
            loop: async function () {
                this.loopCalled = true;
            }
        };

        const sut = new ArduinoSimulator(program);
        
        sut.execute();
        await delay(5);
        await sut.stop();

        expect(program.loopCalled).toBeTruthy();
    });

});