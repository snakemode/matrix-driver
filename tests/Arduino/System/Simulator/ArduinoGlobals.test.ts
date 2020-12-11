import { delay, millis, digitalRead } from "../../../../app/Adruino/System/Simulator/ArduinoGlobals";

describe("delay", () => {
    it("called, pauses execution when awaited", async () => {
        const startTime = Date.now();

        await delay(50);

        const endTime = Date.now();
        const elapsed = endTime - startTime;
        expect(elapsed).toBeGreaterThanOrEqual(49); // Cos rounding.
    });

});

describe("millis", () => {
    it("called, returns time since epoch", async () => {
        const now = Date.now();

        const result = millis();

        expect(result).toBeGreaterThanOrEqual(now);
    });
});

describe("digitalRead", () => {
    it("called, returns false", async () => {
        const result = digitalRead(0);

        expect(result).toBe(false);
    });

});