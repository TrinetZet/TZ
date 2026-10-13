#include "deadline.h"
#include <cassert>
int main(){Deadline expired(0),future;assert(expired.expired());assert(!future.expired());}
