#include <Adafruit_NeoPixel.h>
#include "SnakeLights.h"

Adafruit_NeoPixel strip_; //= Adafruit_NeoPixel(NUM_LIGHTS, cfg_->display.gpioPin, cfg_->display.pixelType);

void SnakeLights::init()
{
  Serial.println("Init Adafruit_NeoPixel...");
  strip_.updateLength(NUM_LIGHTS);
  strip_.updateType(cfg_->display.pixelType);
  strip_.setPin(cfg_->display.gpioPin);
  Serial.println("Done.");

  strip_.begin();
}

void SnakeLights::set_status_pixel(int r, int g, int b)
{  
  clearWithoutFlush();
  strip_.setPixelColor(0, Adafruit_NeoPixel::Color(r, g, b));
  strip_.show();
}

void SnakeLights::clearWithoutFlush()
{
  for (auto i = 0; i < NUM_LIGHTS; i++)
  {
    strip_.setPixelColor(i, Adafruit_NeoPixel::Color(0, 0, 0));
  }
}

void SnakeLights::clear() 
{
  clearWithoutFlush();
  strip_.show();
}

void SnakeLights::testPattern() 
{
  for (auto y = 0; y < HEIGHT; y++)
  {
    for (auto x = 0; x < WIDTH; x++)
    {
      update_pixel_by_coord(x, y, 255, 255, 255, true);
    }
  }
}

void SnakeLights::log(int pixel, int r, int g, int b)
{
  Serial.print(F("Updating lights: "));
  Serial.print(pixel);
  Serial.print(F(":("));
  Serial.print(r);
  Serial.print(F(","));
  Serial.print(g);
  Serial.print(F(","));
  Serial.print(b);
  Serial.print(F(")\r\n"));
}

void SnakeLights::update_pixel_by_coord(int x, int y, int r, int g, int b, boolean autoFlush)
{
  if (x >= WIDTH || y >= HEIGHT)
  {
    return;
  }

  if (x < 0 || y < 0)
  {
    return;
  }

  auto adjusted = adjustXYToMatchDisplay(x, y);
  auto pixel_number = adjusted.pixel_number;

  strip_.setPixelColor(pixel_number, r, g, b);

  if (autoFlush) {
      strip_.show();
  }
}

coord SnakeLights::adjustXYToMatchDisplay(int x, int y)
{
  auto adjustedX = x;
  auto adjustedY = y;

  auto config = cfg_->display;

  if (config.indexMode == index_mode::TOP_LEFT) {
      adjustedX = adjustedX;
  } else if (config.indexMode == index_mode::TOP_RIGHT) {
      adjustedX = ((config.width - 1) - x);
  } else if (config.indexMode == index_mode::BOTTOM_LEFT) {
      adjustedY = ((config.height - 1) - y);
  } else if (config.indexMode == index_mode::BOTTOM_RIGHT) {
      adjustedX = ((config.width - 1) - x);
      adjustedY = ((config.height - 1) - y);
  }

  if (config.carriageReturnMode == carriage_return_mode::REGULAR) {
    auto pixel_number = adjustedX + (adjustedY * config.width);
    return {x : adjustedX, y : adjustedY, pixel_number : pixel_number};
  }

  if (config.carriageReturnMode == carriage_return_mode::SNAKED) {
      auto shouldSnakeX = adjustedY % 2 == 1;

      if (shouldSnakeX) {
          adjustedX = ((config.width - 1) - adjustedX);
      }

      auto pixel_number = adjustedX + (adjustedY * config.width);
      return {x : adjustedX, y : adjustedY, pixel_number : pixel_number};
  }

  if (config.carriageReturnMode == carriage_return_mode::SNAKED_VERTICALLY) {
      auto shouldSnakeY = adjustedX % 2 == 1;

      if (shouldSnakeY) {
          adjustedY = ((config.height - 1) - adjustedY);
      }

      auto pixel_number = adjustedY + (adjustedX * config.height);
      return {x : adjustedX, y : adjustedY, pixel_number : pixel_number};
  }

  return {x : -1, y : -1, pixel_number : -1};
}

void SnakeLights::flush() 
{  
    strip_.show();
}