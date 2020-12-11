#ifndef _MQTTCONNECTION_h
#define _MQTTCONNECTION_h

#if defined(ARDUINO) && ARDUINO >= 100
	#include "arduino.h"
#else
	#include "WProgram.h"
#endif

#include "DataStructures.h"
#include <MQTT.h>

typedef void (*MQTTClientCallbackAdvanced)(MQTTClient *client, char topic[], char bytes[], int length);

class mqtt_connection
{
	public:
		void ensure_mqtt_connected(MQTTClientCallbackAdvanced);
		void process_messages();
		int publish(String message);
		mqtt_connection(configuration *c) {
			cfg_ = c;
		}

	protected:
		configuration* cfg_ = nullptr;	
};

#endif
