import { Adafruit_NeoPixel } from "../../System/ArduinoLibraryClones/Adafruit_NeoPixel";
import { IArduinoProgram } from "../../System/Simulator/IArduinoProgram";
import { delay, millis } from "../../System/Simulator/ArduinoGlobals";

// Which pin on the Arduino is connected to the NeoPixels?
// On a Trinket or Gemma we suggest changing this to 1:
const LED_PIN = 6;

// How many NeoPixels are attached to the Arduino?
const LED_COUNT = 60;

// NeoPixel brightness, 0 (min) to 255 (max)
const BRIGHTNESS = 50;

var strip = new Adafruit_NeoPixel(LED_COUNT, LED_PIN, 800);
// Argument 1 = Number of pixels in NeoPixel strip
// Argument 2 = Arduino pin number (most are valid)
// Argument 3 = Pixel type flags, add together as needed:
//   NEO_KHZ800  800 KHz bitstream (most NeoPixel products w/WS2812 LEDs)
//   NEO_KHZ400  400 KHz (classic 'v1' (not v2) FLORA pixels, WS2811 drivers)
//   NEO_GRB     Pixels are wired for GRB bitstream (most NeoPixel products)
//   NEO_RGB     Pixels are wired for RGB bitstream (v1 FLORA pixels, not v2)
//   NEO_RGBW    Pixels are wired for RGBW bitstream (NeoPixel RGBW products)

export class Program implements IArduinoProgram {

    async setup(): Promise<void> {

        strip.begin();           // INITIALIZE NeoPixel strip object (REQUIRED)
        strip.show();            // Turn OFF all pixels ASAP
        strip.setBrightness(50); // Set BRIGHTNESS to about 1/5 (max = 255)
    }

    async loop(): Promise<void> {
        // Fill along the length of the strip in various colors...
        await colorWipe(strip.Color(255, 0, 0), 50); // Red
        await colorWipe(strip.Color(0, 255, 0), 50); // Green
        await colorWipe(strip.Color(0, 0, 255), 50); // Blue
        await colorWipe(strip.Color(255, 255, 255), 50); // True white (not RGB white)

        // whiteOverRainbow(75, 5);

        await pulseWhite(5);

        await rainbowFade2White(3, 3, 1);
    }

}

// Fill strip pixels one after another with a color. Strip is NOT cleared
// first; anything there will be covered pixel by pixel. Pass in color
// (as a single 'packed' 32-bit value, which you can get by calling
// strip.Color(red, green, blue) as shown in the loop() function above),
// and a delay time (in milliseconds) between pixels.
const colorWipe = async (color, wait) => {
    for (var i = 0; i < strip.numPixels(); i++) { // For each pixel in strip...        
        strip.setPixelColor(i, color);         //  Set pixel's color (in RAM)
        strip.show();                          //  Update strip to match
        await delay(wait);                           //  Pause for a moment
    }
}

const whiteOverRainbow = (whiteSpeed, whiteLength) => {

    if (whiteLength >= strip.numPixels()) whiteLength = strip.numPixels() - 1;

    var head = whiteLength - 1;
    var tail = 0;
    var loops = 3;
    var loopNum = 0;
    var lastTime = millis();
    var firstPixelHue = 0;

    for (; ;) { // Repeat forever (or until a 'break' or 'return')
        for (var i = 0; i < strip.numPixels(); i++) {  // For each pixel in strip...
            if (((i >= tail) && (i <= head)) ||      //  If between head & tail...
                ((tail > head) && ((i >= tail) || (i <= head)))) {
                strip.setPixelColor(i, strip.Color(0, 0, 0, 255)); // Set white
            } else {                                             // else set rainbow
                var pixelHue = firstPixelHue + (i * 65536 / strip.numPixels());
                strip.setPixelColor(i, strip.gamma32(strip.ColorHSV(pixelHue)));
            }
        }

        strip.show(); // Update strip with new contents
        // There's no delay here, it just runs full-tilt until the timer and
        // counter combination below runs out.

        firstPixelHue += 40; // Advance just a little along the color wheel

        if ((millis() - lastTime) > whiteSpeed) { // Time to update head/tail?
            if (++head >= strip.numPixels()) {      // Advance head, wrap around
                head = 0;
                if (++loopNum >= loops) return;
            }
            if (++tail >= strip.numPixels()) {      // Advance tail, wrap around
                tail = 0;
            }
            lastTime = millis();                   // Save time of last movement
        }
    }
}

const pulseWhite = async (wait) => {
    for (var j = 0; j < 256; j++) { // Ramp up from 0 to 255
        // Fill entire strip with white at gamma-corrected brightness level 'j':
        strip.fill(strip.Color(0, 0, 0, strip.gamma8(j)));
        strip.show();
        await delay(wait);
    }

    for (var j = 255; j >= 0; j--) { // Ramp down from 255 to 0
        strip.fill(strip.Color(0, 0, 0, strip.gamma8(j)));
        strip.show();
        await delay(wait);
    }
}

const rainbowFade2White = async (wait, rainbowLoops, whiteLoops) => {
    var fadeVal = 0, fadeMax = 100;

    // Hue of first pixel runs 'rainbowLoops' complete loops through the color
    // wheel. Color wheel has a range of 65536 but it's OK if we roll over, so
    // just count from 0 to rainbowLoops*65536, using steps of 256 so we
    // advance around the wheel at a decent clip.
    for (let firstPixelHue = 0; firstPixelHue < rainbowLoops * 65536; firstPixelHue += 256) {

        for (var i = 0; i < strip.numPixels(); i++) { // For each pixel in strip...

            // Offset pixel hue by an amount to make one full revolution of the
            // color wheel (range of 65536) along the length of the strip
            // (strip.numPixels() steps):
            var pixelHue = firstPixelHue + (i * 65536 / strip.numPixels());

            // strip.ColorHSV() can take 1 or 3 arguments: a hue (0 to 65535) or
            // optionally add saturation and value (brightness) (each 0 to 255).
            // Here we're using just the three-argument variant, though the
            // second value (saturation) is a constant 255.
            strip.setPixelColor(i, strip.gamma32(strip.ColorHSV(pixelHue, 255, 255 * fadeVal / fadeMax)));
        }

        strip.show();
        await delay(wait);

        if (firstPixelHue < 65536) {                              // First loop,
            if (fadeVal < fadeMax) fadeVal++;                       // fade in
        } else if (firstPixelHue >= ((rainbowLoops - 1) * 65536)) { // Last loop,
            if (fadeVal > 0) fadeVal--;                             // fade out
        } else {
            fadeVal = fadeMax; // varerim loop, make sure fade is at max
        }
    }

    for (var k = 0; k < whiteLoops; k++) {
        for (var j = 0; j < 256; j++) { // Ramp up 0 to 255
            // Fill entire strip with white at gamma-corrected brightness level 'j':
            strip.fill(strip.Color(0, 0, 0, strip.gamma8(j)));
            strip.show();
        }
        delay(1000); // Pause 1 second
        for (var j = 255; j >= 0; j--) { // Ramp down 255 to 0
            strip.fill(strip.Color(0, 0, 0, strip.gamma8(j)));
            strip.show();
        }
    }

    await delay(500); // Pause 1/2 second
}

