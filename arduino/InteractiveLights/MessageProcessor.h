#ifndef _MESSAGEPROCESSOR_h
#define _MESSAGEPROCESSOR_h

#if defined(ARDUINO) && ARDUINO >= 100
#include "arduino.h"
#else
#include "WProgram.h"
#endif

#include "MqttConnection.h"
#include "SnakeLights.h"

class message_processor
{
public:
	void process(char bytes[], int length);
	void processSetPixelsMessage(const char *, int);
	void processControlMessage(const char *, int);
	void processSetTextMessage(const char *, int);
	void drawEntireString(const char *bytes, int length, int shiftXpositionBy, int r, int g, int b);
	void drawSpriteAtPosition(int *sprite, int width, int xOffset, int r, int g, int b);
	void printTextMessage(const char *bytes, int length);

	message_processor(configuration *c, mqtt_connection *mqtt, SnakeLights *lights)
	{
		cfg_ = c;
		mqtt_ = mqtt;
		lights_ = lights;
	}

protected:
	configuration *cfg_ = nullptr;
	mqtt_connection *mqtt_ = nullptr;
	SnakeLights *lights_ = nullptr;
};

#endif
