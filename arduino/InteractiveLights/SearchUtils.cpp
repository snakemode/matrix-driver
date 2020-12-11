#include "SearchUtils.h"

int search_utils::indexOf(const char *bytes, int length, int byteValueToFind)
{
    for (auto i = 0; i < length; i++)
    {
        if ((int)bytes[i] == byteValueToFind)
        {
            return i;
        }
    }
    return -1;
}
