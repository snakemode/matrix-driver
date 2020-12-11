#if defined(ESP32)
#include <WiFi.h>
#else
#include <ESP8266WiFi.h>
#endif
#include "MqttConnection.h"
#include "DataStructures.h"
#include <WiFiClientSecure.h>
#include <MQTT.h>

WiFiClientSecure espClient;
MQTTClient client(2048);

void mqtt_connection::ensure_mqtt_connected(MQTTClientCallbackAdvanced callback)
{ 
  if (client.connected()) {
    return;
  }
    
  espClient.setFingerprint(cfg_->mqtt.certificate);

  client.begin(espClient);
  client.setHost(cfg_->mqtt.server, cfg_->mqtt.port);

  client.onMessageAdvanced(callback);

  while (!client.connected()) 
  {    
    Serial.print(F("Attempting MQTT connection..."));

    if (client.connect("tshirtHardware", cfg_->mqtt.user, cfg_->mqtt.password))
    {
      Serial.println(F("Connected."));
      client.subscribe(cfg_->mqtt.subscription);
    } 
    else 
    {
      lwmqtt_err_t error = client.lastError();
      Serial.println(error);
      Serial.println(F("Failed to connect to MQTT - Trying again in 5 seconds..."));
      delay(5000);
    }
  }
  
}

void mqtt_connection::process_messages()
{ 
	client.loop();
}

int mqtt_connection::publish(String message) 
{
	return client.publish(cfg_->mqtt.subscription, message);
}
