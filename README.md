# matrix-driver

This repository contains a TypeScript / JavaScript SDK for NeoPixel LED strips and matrcies.

It lets you use JavaScript or TypeScript to connect to any NeoPixel compatible LED matrix that you can find, hopefully smoothing over the difference between them.

It allows you to send images, pixels and fast scrolling text to NeoPixel LED matrixes, attached to `ESP8266` and other Arduino compatible hardware. It's designed to be configured to work with arrays of any size, and to work with matrixes wired together in an assortment of ways.

The Arduino Sketch provided can be used as is, or as the basis for a more sophisticated piece of hardware.

The SDK communicates with the hardware primarily over `MQTT` - but you can implement your own `Message Transport` if you'd like (for Bluetooth, or HTTP communication). This SDK communicates with the hardware devices in its own binary serialization format, for performance over bandwidth constrained connections.

There is a bundled `MQTT` provider that uses the hosted services of `Ably.io` as an example of implementing one of these transports.

* Usage
* * Quickstart
* * JavaScript
* * Arduino
* MQTT setup
* Developers Guide
* Writing your own transport
* Writing your own hardware adapter
* The Arduino Simulator

# I know what I'm doing, just tell me how to use this

Ok sure!

* Make sure you know what MQTT is and have a valid MQTT server and credentials
* NPM install @snakemode/matrix-driver using NPM
* Create a `RemoteMatrixLedDriver` that matches your hardware configuration (See below for details)
* Open the Arduino Sketch in `/arduino/InteractiveLights/InteractiveLights.ino` and edit `Configuration.h`
* Flash the sketch to some compatible hardware
* Send commands to the hardware from your web or node app using the `RemoteMatrixLedDriver` using TypeScript or JavaScript

Want to know more? Keep reading :)

# Usage

This project comes in two parts:

* A JavaScript SDK called `matrix-driver`
* An Arduino Sketch called `InteractiveLights`

The Arduino sketch is built and tested against an `ESP8266` develoment board, and should work on an `ESP32` board.
These development boards are very cheap and accessible, costing around $10, sometimes for packs of 3.

We tested this code against an `AdaFruit Feather Huzzah`.

You'll also need a `NeoPixel` compatible `LED Matrix` or any strip of `addressable LEDs`.

These strips vary in availablilty and quality, and often have quirks between them - but we're using the `AdaFruit NeoPixel` SDK under the hood, so anything that works with that, will work with this project.

# JavaScript

The SDK package installs via NPM, and is designed to run in either a Node.js project, or to be imported into a browser based project as an ES Module.

```bash
npm install @snakemode/matrix-driver --save
```

Then in your application, you need to create an instance of the `RemoteMatrixLedDriver`

```js
import {
  default as RemoteMatrixLedDriver,
  ArduinoDeviceAdapter,
  AblyTransport
} from "@snakemode/matrix-driver";

const ablyClient = new Ably.Realtime.Promise({ authUrl: '/api/createTokenRequest' });

const ledDriver = new RemoteMatrixLedDriver({
    displayConfig: { width: 32, height: 8 },
    deviceAdapter: new ArduinoDeviceAdapter(new AblyTransport(ablyClient))
});
```

This example illustrates using the `AblyTransport` to connect to `MQTT`. We've got an API setup to execute when you run `npm run start` in this repository that provides the Ably SDK with an API key to send messages.

Once you have an instance of `RemoteMatrixLedDriver`, you can send messages to your hardware using JavaScript or Typescript.

```ts
// You can set pixels, with optional colours, in either hex or { r, g, b} format
ledDriver.pixel.set({ x: 5, y: 5, color: "#FFFFFF" });

// Y-Coordinates are optional and default to 0 for single strip LED arrays
ledDriver.pixel.set([{ x: 1, color: "#ff0000" }, { x: 2 }]);

// You can set the entire display at once
ledDriver.pixel.setAll([
    "                                ",
    "                                ",
    "          #                     ",
    "                                ",
    "                         #      ",
    "                                ",
    "                                ",
    "                                ",
], "#FFFFFF", true);


// You can scroll text!
ledDriver.text.scroll("The quick brown fox jumped over the lazy dog");

// And provide colour details
ledDriver.text.scroll("The quick brown fox jumped over the lazy dog", "#FF0000", 25 /* scroll speed */);

// and even send entire images to your LEDs
ledDriver.image.set("./test.png");
```

The SDK comes with full TypeScript typings so any editor that supports IntelliSense and AutoComplete should benefit from them.

You must make sure you're using a transport that can connect to your device for this code to work, and that the device is running the provided `InteractiveLights` sketch.

# Arduino Hardware

To compile the arduino sketch found in `/arduino/InteractiveLights/InteractiveLights.ino` you'll need a copy of the `Arduino IDE` and some supporting libraries. This repository was built against the following requirements:

* Arduino IDE - 1.8.42
* MQTT by Joel Gaehwiler - 2.4.8
* Adafruit NeoPixel - 1.7.0

The MQTT library, and the NeoPixel library are both installable from the Library Manager in the Arduino IDE.

Additionally, from Tools -> Boards -> Board Manager, ensure you're running 

* Arduino AVR Boards - 1.8.3
* ESP8266 Community - 2.7.4
* ESP32 - 1.0.4

Or later, and depending on the hardware you're flashing the sketch to.

If all of those dependencies are met, you need to build and flash the sketch to your device.

* Firstly, open `/arduino/InteractiveLights/InteractiveLights.ino`
* Configure your build by editing `Configuration.h` - which will show as one of the tabs in Arduino IDE.

`Configuration.h` looks like this:

```c++
#ifndef _CONFIGURATION_h
#define _CONFIGURATION_h

// Wifi Config
const char *ssid = "your-ssid";
const char *password = "your-password";

// MQTT Config
const char *mqtt_host = "your.mqtt.host.com";
const int mqtt_port = 8883;
const char *mqtt_username = "mqtt-username-or-first-half-of-ably-key";
const char *mqtt_password = "mqtt-password-or-second-half-of-ably-key";
const char *ssl_thumbprint = "cdbd9920909d5f69e5766ab0d120de33c243306e"; // The SSL thumbprint of your mqtt host
const char *mqtt_topic = "leds";

// Display config
const int display_gpio_pin = 4;
const int display_width = 32;
const int display_height = 8;

const index_mode display_connector_location = index_mode::TOP_LEFT;
const carriage_return_mode line_wrap = carriage_return_mode::SNAKED;
const neoPixelType neopixel_type = NEO_GRB + NEO_KHZ800;

#endif
```

You're going to need to make sure all these settings are correct for your environment before you flash your hardware.

Your wifi settings go in ssid/password, you'll need to find or set up an MQTT broker to send messages to your device (we'll talk about this later), and you need to configure your MQTT credentials in those settings.

Finally, you need to configure your LED matrix.

These three lines

```c++
const index_mode display_connector_location = index_mode::TOP_LEFT;
const carriage_return_mode line_wrap = carriage_return_mode::SNAKED;
const neoPixelType neopixel_type = NEO_GRB + NEO_KHZ800;
```

Allow you to setup your specific LEDs to work with this hardware. Many of these addressable LED clones are put together in weird and wonderful ways, so you may have a board that connects at the top left, top right, bottom left or bottom right of the set of LEDs.

You might have a board where the pixel numbers are inverted every other row because it's wired like a snake (something we affectionately call `snakemode`) - you're gonna have to look at what you have and work out how they work, along with the neopixel_type settings (could be RGB, could be GRB, could be ARGB, who knows!).

The available settings are:

```c++
typedef enum
{
  TOP_LEFT = 0,
  TOP_RIGHT = 1,
  BOTTOM_LEFT = 2,
  BOTTOM_RIGHT = 3
} index_mode;

typedef enum
{
  REGULAR = 0,
  SNAKED = 1,
  SNAKED_VERTICALLY = 2
} carriage_return_mode;
```

Depending on what you configure, the Arduino code will convert the x,y coordinates you send to the device to correct `PixelIds` for the hardware you attach at run time.

This is really the main thing that this code does - it means we can write client code once, and connect to the weird and wonderfully diverse range of LED arrays there are out there.

# MQTT setup

You can't talk to your device without a way to send message, and the Arduino sketch provided uses MQTT to listen for them.
It could absolutely be modified to poll for messages over HTTP, or listen over Bluetooth on compatible hardware, but MQTT is the easiest way to get started.

## What is MQTT

TL;DR - MQTT is a low-bandwidth protocol designed for IoT and other low bandwidth devices.
MQTT messages get delivered via an `MQTT Broker` - this is the service that our hardware will connect to to collect messages.
MQTT brokers connect either over the mqtt protocol, or mqtts - the latter using SSL for security.

To use MQTT, you're going to need a broker. You can set one up yourself if you like - if you want to do that - go look up `Mosquitto MQTT Broker` and learn about that before coming back here.

If setting up your own MQTT broker sounds too much like hard work (which it probably does), we can recommend using `Ablys` services - Ably provides a pub/sub messaging service with easy to use SDKs. The cool bit is, if you use Ably, any messages you send using their service also get sent over MQTT.

Ably offer entry level free accounts you can try this approach with, where their API key can be used as a username and password in your `Configuration.h` config on your Arduino hardware.

By default, we support an Ably `MQTT` transport, though if you were to use another `MQTT` service, you could implement another MQTT connection. Unfortunately, MQTT requires making SSL/TLS connections, and you can't open raw TCP connections using TLS from JavaScript in the browser - so the MQTT service you use would either have to support http->mqtt (like Ably does), or you'd have to proxy the request and send the data from the server side.

The demo in this project uses Ably MQTT and Ablys Token Authentication to manage credentials


```js
const ablyClient = new Ably.Realtime.Promise({ authUrl: '/api/createTokenRequest' });

const ledDriver = new RemoteMatrixLedDriver({
    displayConfig: { width: 32, height: 8 },
    deviceAdapter: new ArduinoDeviceAdapter(new AblyTransport(ablyClient))
});
```

This involves you having an API on `/api/createTokenRequest` that does the Ably token exchange.

This repository comes complete with an `Azure Static Web Apps` demo, and an included API that deals with token exchange for you on that `URL`. If you were less concerend with security, you could always configure the Ably client with your actual API key (though this is strongly discouraged because people will be able to steal your API key!)


# Developers Guide

A brief outline of how this all hangs together and works.

The `RemoteMatrixLedDriver` is a facade over three different APIs - the `TextApi`, `PixelApi` and `ImageApi`.
These three APIs are the developer facing surface area of this package. They provide all the sweet sweet syntatic sugar that allows us to just call `pixel.set` and give it pretty much anything, and it work.

# The Device Adapters

Underneath these friendly APIs, the `RemoteMatrixLedDriver` depends on an `IDeviceAdapter` adapter instance being provided to it when it is created.

The `IDeviceAdapter` interface looks like this - 

```ts
export interface IDeviceAdapter {
    sendPixels(payload: SetPixelsMessage): void;
    sendText(payload: SetTextMessage): void;
    sendControlMessage(payload: ControlMessage): void;
}
```

And any device that wants to be compatible with the `RemoteMatrixLedDriver` needs a device adapter written for it. Our default one is the `ArduinoDeviceAdapter`, and it implements our own wire protocol that we've flippantly called the `PixelProtocol` (sadly, no more descriptive names sprung to mind).

Our default `ArduinoDeviceAdapter` matches the code in our `InteractiveLights` sketch, which has built in deserialisation and message processing commands that understand the binary data we're packing into our `MQTT messages`.

## Message Types

You'll notice from the `IDeviceAdapter` interface, that the `RemoteMatrixLedDriver` higher level code deals in three kinds of messages

* `SetPixelsMessage`
* `SetTextMessage`
* `ControlMessage`

The contents of these messages obviously varies and can expand over time, but to make a Device adapter, you need to write some code that can take those messages, and convert them into a format that your target hardware can understand.

If you can write an `IDeviceAdapter` implementation that can transmit these messages to a device, you can plug it into this library.

# The Wire Protocol and Binary Serializers

Because our target `Arduino` hardware is resource constrained, there's not much memory for us to use typical message formats like JSON, XML or YML. We've worked in plain text on these devices in the past, and not only does processing text data use up a lot of memory, the C code required to parse text is long, memory hungry, and error prone.

As a result we've designed a very low ceremony binary protocol that each of our three message types can serialize down to - vastly reducing the amount of work that the hardware does when it gets the message.

Each of the messages has a serializer class:

* `SetPixelsMessage` - `SetPixelSerialzer`
* `SetTextMessage` - `SetTextMessageSerializer`
* `ControlMessage` - `ControlMessageSerializer`

Generally, each of our messages follows the following format, as a binary string

```
0x11, 0x50, MESSAGE SPECIFIC DATA, 0x03, 0x04
DC1 , "P" , S                    , EOT , EoTrans
```

We start by sending a `Device Control 1` byte of data, followed by a single ASCII character code of either `P`, `T` or `C` - for Pixel, Text or Control modes.

Then we serialize the message data for each of those messages, followed by an `End of Text` and an `End of Transmission` byte.

The simplest message format is our `ControlMessage` - mostly because it just sends a signal to clear the screen, with other commands reserved for later use. It's serialization code looks like this, in `TypeScript`

```ts
const binaryCommands: number[] = [
    AsciiControlCodes.DeviceControl1,
    AsciiControlCodes.C_ControlMessage,
    AsciiControlCodes.STX_StartOfText,
    message.type,
    AsciiControlCodes.ETX_EndOfText,
    AsciiControlCodes.EOT_EndOfTransmission
];
```

You can see the `ASCII control codes` being stacked around the single value `message.type` that we're putting into that message to be sent over MQTT.

By contrast - serializing images, and pixel data, is a little bit more involved

Example packet:

    0x11, 0x50, 0x02, 255, 255, 255, 0, 0, 0x17, 0x02, 255, 255, 0, 1, 0, 0x03, 0x04
    DC1 , "P" , STX , red, gre, blu, x, y, EOB , STX , Red, Gre, B, x, y, EOT , EoTrans

    DC1 = Device Control 1
    P = "Pixel mode",
    STX = Start of transmission
    R, G, B values
    Any number of X, Y locations
    EOB = end of pixel block
    STX = subsequent pixel
    R, G, B values
    Any number of X, Y locations
    (repeats, for every set of colors in data)
    EOT = All pixel data complete
    EOT = End of message

You can see that we send the device control and pixel codes, then we send batches of pixels, sorted by colour, and bookended by `STX` start of text, and `EOB` end of block bytes.

The parsing code in our Arduino sketch loops through these bytes, setting LED lights as it encounters the colours and pixel locations.

The text protocol is simpler by comparison, let's take a look at it's serialization code

```ts
// Put the hardware into text mode

const binaryCommands = [
    AsciiControlCodes.DeviceControl1,
    AsciiControlCodes.T_TextMode,
    message.mode
];

// Add a scroll speed

binaryCommands.push(message.scrollSpeedMs);

// Set the text color

binaryCommands.push(
    message.color.r,
    message.color.g,
    message.color.b
);

// Flag the start of the text sequence

binaryCommands.push(AsciiControlCodes.STX_StartOfText);

// Add all the ASCII bytes

for (let character of message.value) {
    binaryCommands.push(character.charCodeAt(0));
}

// End the message

binaryCommands.push(
    AsciiControlCodes.ETX_EndOfText,
    AsciiControlCodes.EOT_EndOfTransmission
);
```

The Arduino sketch has text rasterising code built in that converts this stream of actual ASCII text into scrolling pixels.
We generated a font file, and converted in into a binary blob of pixel data that we've stored in the Arudio sketch (in `SpriteSheet.cpp` if you're interested in how!), and the hardware generates characters as it parses the message.

## Transports

If our `RemoteMatrixLedDriver` provides the high level API, and the `IDeviceAdapters` orchestrate converting our internal message formats into something that can be sent down the wire - the Device Adapters need a suitable way to do so.

Our `Arduino Device Adapter` relies on an Ably `MQTT Transport` to take the binary serialized messages, and send them across the network.

There's very little to see here as in our initial implementation, the Ably service is doing all the work - but we could switch our MQTT for other protocols by providing alternate implementations of `IMessageTransport`.

The interface looks like this:

```ts
export type WireFormattedMessage = Uint8Array | string;
export interface IMessageTransport {
    send(payload: WireFormattedMessage): Promise<void>;
}
```
The rest of the implementation depends on the way messages are sent.

## The Arduino Simulator

If you're eagle eyed, you might notice that this project, that's designed as an NPM package, actually appears to have a demo page built into it. Hold on tight, we're going well off the reservation here.

If you

```bash
npm i
npm run start
```

in the repository directory, it'll spin up both an `Azure Static Web Apps` API, and a `snowpack` development server that'll load a demo page.

This demo page uses an `Arduino Simulator` and a `TypeScript` port of our C++ code, along with some stubbed out `Arduino libraries` to run a fake LED matrix in your browser, that you can send messages to and "light up the fake LEDs". This may appear to be some kind of sleep deprived insanity, but there is a method in all of this madness.

The development workflow for dealing with much of the low level hardware things in this project is... long winded, all in C++, and fairly ardious. The entire reason this project exists is to shift the hard work done on many of our hardware projects up into programming languages with more rapid feedback cycles than the minutes long dev cycles it takes to repeatedly deploy to physical hardware.

After building 5 or 6 different permutations of projects that send pixel data over the network to Arduino hardware, our souls broken, oru spirits crushed, we searched for easier ways to work and rapidly prototype.

So... we built a *very very very* threadbare Arduino **simulator**.

What does that mean? Well, we built some `TypeScript` classes that will kind of mostly sort of behave like the Arduino hardware does at runtime. We stubbed out the NeoPixels APIs in TypeScript. We cloned some of the low level Arduino directives and macros like `delay` and adapted them to mostly work with async / await in the browser.

We then ported a few of the example Arduino NeoPixel samples that ship with that SDK to TypeScript - and it's alarmingly much simpler than you might think as TypeScript is a C like language, and C is... C.

So our dev workflow for the low level hardware portions of this project actually happened in `TypeScript` in `Jest tests` and in the browser.

Once we'd ironed out the bugs in our `TypeScript` version, we then translated the code back into C.  What this means, if you go digging around the `TypeScript` implementation is that the code looks pretty weird, and avoids using most of `TypeScripts` nice features, in favour of implementing things in a C-like way that you would absolutely never do in another place.

We did this specifically to make the transliteration to C trivial, and so we kept both our `TypeScript` and `C` codebases in step with minimal modification.

The really cool thing about this, is while you're debugging on the hardware, you can actually watch the Virtual LED Matrix in your browser respond in the same way as the physical devices. We used our in-browser Virtual LED Matrix to make sure we were compatible with different bits of hardware wired in different ways.

This may seem like a long road to avoid "just debugging some C", but if you've ever done much embedded programming, you'll probably realise that a couple of hours stubbing out a few interfaces is nothing compared to debugging on real hardware!

# Credits

snakemode 2020