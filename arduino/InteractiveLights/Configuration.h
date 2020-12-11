#ifndef _CONFIGURATION_h
#define _CONFIGURATION_h

// Wifi Config
const char *ssid = "ilikepie";
const char *password = "Goldfish54!";

// MQTT Config
const char *mqtt_host = "mqtt.ably.io";
const int mqtt_port = 8883;
const char *mqtt_username = "first-part-of-ably-api-key";
const char *mqtt_password = "second-part-of-ably-api-key";
const char *ssl_thumbprint = "0e98bcfdccfade0103746da824162ae0e9c6bb4b"; // verify the in your browser
const char *mqtt_topic = "leds";

// Display config
const int display_gpio_pin = 4;
const int display_width = 32;
const int display_height = 8;

const index_mode display_connector_location = index_mode::TOP_LEFT;
const carriage_return_mode line_wrap = carriage_return_mode::SNAKED_VERTICALLY;
const neoPixelType neopixel_type = NEO_GRB + NEO_KHZ800;

#endif
