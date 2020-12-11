#include "MessageProcessor.h"
#include "SnakeLights.h"
#include "SpriteSheet.h"
#include "SearchUtils.h"

const byte DeviceControl1 = 0x11;
const byte STX_StartOfText = 0x02;
const byte ETB_EndOfBlock = 0x17;
const byte ETX_EndOfText = 0x03;
const byte EOT_EndOfTransmission = 0x04;
const byte C_ControlMessage = 0x43;
const byte P_PixelMode = 0x50;
const byte S_ScrollMode = 0x53;
const byte T_TextMode = 0x54;
const byte RS_RecordSeparator = 0x1E;

String Empty = "";

sprite_sheet sprites;

void message_processor::process(char bytes[], int length)
{
  if (length == 0)
    return;

  auto controlCode = (int)bytes[0];
  if (controlCode != DeviceControl1)
  {
    Serial.println("Not a device control command.");
    return;
  }

  auto controlMode = bytes[1];

  Serial.println("Device Control 1 Message received. Mode is:");
  Serial.println((char)controlMode);

  switch (controlMode)
  {
  case P_PixelMode:
    processSetPixelsMessage(bytes, length);
    return;
  case C_ControlMessage:
    processControlMessage(bytes, length);
    return;
  case T_TextMode:
    processSetTextMessage(bytes, length);
    return;
  }
}

void message_processor::processSetPixelsMessage(const char *bytes, int length)
{
  Serial.println(F("processSetPixelsMessage"));

  auto inPixelBlock = false;
  auto r = 0;
  auto g = 0;
  auto b = 0;

  for (auto i = 0; i < length; i++)
  {
    auto current = (int)bytes[i];

    if (inPixelBlock)
    {
      auto x = current;
      auto y = (int)bytes[++i];

      lights_->update_pixel_by_coord(x, y, r, g, b, false);

      auto next = bytes[i + 1];

      if (next != RS_RecordSeparator)
      {
        inPixelBlock = false;
      }
      else
      {
        i++;
      }

      continue;
    }

    if (current == EOT_EndOfTransmission)
    {
      break;
    }

    if (current == ETB_EndOfBlock)
    {
      inPixelBlock = false;
      continue;
    }

    if (current == STX_StartOfText)
    {
      r = bytes[++i];
      g = bytes[++i];
      b = bytes[++i];
      inPixelBlock = true;
      continue;
    }
  }

  lights_->flush();
}

void message_processor::processControlMessage(const char *bytes, int length)
{
  Serial.println(F("processControlMessage"));

  auto controlMessageType = (int)bytes[3];

  if (controlMessageType == 0)
  {
    lights_->clear();
  }
}

void message_processor::processSetTextMessage(const char *bytes, int length)
{
  auto messageModeByte = (int)bytes[2];
  auto scrollSpeedMs = (int)bytes[3];
  auto r = (int)bytes[4];
  auto g = (int)bytes[5];
  auto b = (int)bytes[6];

  auto shouldScroll = messageModeByte == 1;

  printTextMessage(bytes, length);

  if (shouldScroll)
  {
    Serial.println(F("Scrolling enabled."));

    auto maxWidthOffLeft = sprites.getTotalWidthOfText(bytes, length) * -1;

    auto scrollPosition = cfg_->display.width;
    while (scrollPosition > maxWidthOffLeft)
    {
      lights_->clearWithoutFlush();
      drawEntireString(bytes, length, scrollPosition, r, g, b);

      scrollPosition--;

      delay(scrollSpeedMs);
    }
  }
  else
  {
    Serial.println(F("Scrolling disabled."));
    drawEntireString(bytes, length, 0, r, g, b);
  }
}

void message_processor::drawEntireString(const char *bytes, int length, int shiftXpositionBy, int r, int g, int b)
{
  auto textStart = search_utils::indexOf(bytes, length, STX_StartOfText) + 1;
  auto footerLength = 2;
  auto spaceWidth = 1;

  auto xPosition = shiftXpositionBy;

  for (auto i = textStart; i < length - footerLength; i++)
  {
    auto asciiCode = bytes[i];
    auto spriteAndWidth = sprites.spriteDataFor(asciiCode);

    drawSpriteAtPosition(spriteAndWidth.spriteData, spriteAndWidth.width, xPosition, r, g, b);

    xPosition += spriteAndWidth.width + spaceWidth;
  }

  lights_->flush();
}

void message_processor::drawSpriteAtPosition(int *sprite, int width, int xOffset, int r, int g, int b)
{
  auto bytePosition = 0;

  for (auto y = 0; y < 8; y++)
  {
    for (auto x = 0; x < width; x++)
    {
      auto value = sprite[bytePosition++];
      auto alignedX = x + xOffset;

      if (value == 1)
      {
        lights_->update_pixel_by_coord(alignedX, y, r, g, b, false);
      }
    }
  }
}

void message_processor::printTextMessage(const char *bytes, int length)
{
  auto textStart = search_utils::indexOf(bytes, length, STX_StartOfText) + 1;
  auto textEnd = search_utils::indexOf(bytes, length, ETX_EndOfText);

  Serial.println("processSetTextMessage is:");

  for (auto i = textStart; i < textEnd; i++)
  {
    char character = bytes[i];
    Serial.print(character);
  }

  Serial.println("");
}
