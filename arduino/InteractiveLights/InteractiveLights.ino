#include "DataStructures.h"
#include "Configuration.h"
#include "SnakeLights.h"
#include "MessageProcessor.h"
#include "MqttConnection.h"
#include "Networking.h"
#include <MQTT.h>
#ifdef __AVR__
#include <avr/power.h>
#endif

int interval = 10;

configuration cfg = {
    {ssid, password},
    {mqtt_host, mqtt_port, mqtt_username, mqtt_password, ssl_thumbprint, mqtt_topic},
    {display_width, display_height, display_connector_location, line_wrap, display_gpio_pin, neopixel_type}
};

SnakeLights *snakeLights = new SnakeLights(&cfg);
mqtt_connection *mqtt = new mqtt_connection(&cfg);
message_processor *processor = new message_processor(&cfg, mqtt, snakeLights);

void process(MQTTClient *client, char topic[], char payload[], int payload_length)
{
  processor->process(payload, payload_length);
}

void setup()
{
  Serial.begin(115200);
  delay(1000);

  snakeLights->init();

  snakeLights->set_status_pixel(255, 0, 0);
  Serial.println("Testing WiFi connection...");

  networking::ensure_wifi_connected(cfg.wifi.ssid, cfg.wifi.password);

  snakeLights->set_status_pixel(153, 153, 0);
  Serial.println("Testing MQTT connection...");

  mqtt->ensure_mqtt_connected(process);

  Serial.println("Device is now ready.");
  snakeLights->set_status_pixel(0, 255, 0);
  delay(1000); // So we can *see* the green light!
  
  snakeLights->clear();
}

void loop()
{
  // snakeLights->testPattern();
  // delay(2000);

  networking::ensure_wifi_connected(cfg.wifi.ssid, cfg.wifi.password);
  mqtt->ensure_mqtt_connected(process);
  mqtt->process_messages();

  delay(interval);
}