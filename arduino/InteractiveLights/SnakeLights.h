#include <Adafruit_NeoPixel.h>
#ifndef _SNAKELIGHTS_h
#define _SNAKELIGHTS_h

#if defined(ARDUINO) && ARDUINO >= 100
#include "arduino.h"
#else
#include "WProgram.h"
#endif

#include "DataStructures.h"

class SnakeLights
{
public:
	void init();
	void set_status_pixel(int r, int g, int b);
	void clear();
	void clearWithoutFlush();
	void testPattern();
	void flush();
	void update_pixel_by_coord(int x, int y, int r, int g, int b, bool autoFlush);

	SnakeLights(configuration *c)
	{
		cfg_ = c;
		NUM_LIGHTS = c->display.width * c->display.height;
		WIDTH = c->display.width;
		HEIGHT = c->display.height;
	}

private:
	configuration *cfg_ = nullptr;
	int NUM_LIGHTS;
	int WIDTH;
	int HEIGHT;

	coord adjustXYToMatchDisplay(int x, int y);
	int adjust_for_snake_mode(int pixel);
	void log(int pixel, int r, int g, int b);	
};

#endif
