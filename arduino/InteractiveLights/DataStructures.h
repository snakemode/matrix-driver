#ifndef _DATASTRUCTURES_h
#define _DATASTRUCTURES_h
#include <Adafruit_NeoPixel.h>

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

typedef struct
{
  int x;
  int y;
  int pixel_number;
} coord;

typedef struct
{
  const char* ssid;
  const char* password;  
} wifiCredentials;

typedef struct
{
  const char* server;
  const int port;
  const char* user;
  const char* password;
  const char* certificate;
  const char* subscription;
} mqttConfiguration;

typedef struct
{
  const int width;
  const int height;
  const index_mode indexMode;
  const int carriageReturnMode;

  const int gpioPin;
  const neoPixelType pixelType;
} displayConfiguration;

typedef struct
{
  wifiCredentials wifi;  
  mqttConfiguration mqtt;
  displayConfiguration display;
} configuration;

#endif