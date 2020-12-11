import { Adafruit_NeoPixel } from "../../System/ArduinoLibraryClones/Adafruit_NeoPixel";
import { IArduinoProgram } from "../../System/Simulator/IArduinoProgram";
import { delay, digitalRead } from "../../System/Simulator/ArduinoGlobals";

// the data pin for the NeoPixels
var neoPixelPin = 6;

// How many NeoPixels we will be using, charge accordingly
var numPixels = 60;

var strip = new Adafruit_NeoPixel(numPixels, neoPixelPin, 800);

// Color set #1
var r1 = 255;
var g1 = 0;
var b1 = 0;

// Color set #2
var r2 = 255;
var g2 = 255;
var b2 = 0;

// Color set #3
var r3 = 0;
var g3 = 255;
var b3 = 255;

// our button
var switchPin = 4;

var start1 = 0;
var start2 = 20;
var start3 = 40;

export class Program implements IArduinoProgram {

    async setup(): Promise<void> {
        strip.begin();  // initialize the strip
        strip.show();   // make sure it is visible
        strip.clear();  // Initialize all pixels to 'off'
    }

    async loop(): Promise<void> {
        // Check to see if switch is on/off and call the proper function
        if (digitalRead(switchPin) == true)
            this.allOff();
        else
            this.activate();

        // delay for the purposes of debouncing the switch
        await delay(2000);

    }

    allOff() {
        strip.clear();
        strip.show();
    }
    // the adjustStarts() function will move the starting point of the for loop to imitiate a cycling effect

    activate() {
        this.adjustStarts();

        // first 20 pixels = color set #1
        for (let i = start1; i < start1 + 20; i++) {
            strip.setPixelColor(i, r1, g1, b1);
        }

        // next 20 pixels = color set #2
        for (let i = start2; i < start2 + 20; i++) {
            strip.setPixelColor(i, r2, g2, b2);
        }

        // last 20 pixels = color set #3
        for (let i = start3; i < start3 + 20; i++) {
            strip.setPixelColor(i, r3, g3, b3);
        }

        strip.show();
    }

    adjustStarts() {
        start1 = this.incrementStart(start1);
        start2 = this.incrementStart(start2);
        start3 = this.incrementStart(start3);
    }

    incrementStart(startValue: number): number {
        startValue = startValue + 20;
        if (startValue == 60)
            startValue = 0;

        return startValue;
    }
}