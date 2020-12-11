#ifndef _SEARCHUTILS_H
#define _SEARCHUTILS_H

#if defined(ARDUINO) && ARDUINO >= 100
#include "arduino.h"
#else
#include "WProgram.h"
#endif

class search_utils
{
public:
    static int indexOf(const char *bytes, int length, int byteValueToFind);
};

#endif
