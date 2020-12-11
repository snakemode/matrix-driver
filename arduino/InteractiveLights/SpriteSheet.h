#ifndef _SPRITESHEET_H
#define _SPRITESHEET_H

#if defined(ARDUINO) && ARDUINO >= 100
#include "arduino.h"
#else
#include "WProgram.h"
#endif

typedef struct
{
	int spriteData[40];
	int width;
} sprited_character;

class sprite_sheet
{
public:
	sprited_character spriteDataFor(int requestedCharacter);
	int getTotalWidthOfText(const char *bytes, int length);
	int indexOf(const char *bytes, int length, int byteValueToFind);
	int indexOfSprite(char character);
	bool supportsSprite(char character);
};

#endif
