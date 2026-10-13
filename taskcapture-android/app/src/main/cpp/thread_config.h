#pragma once
#include <algorithm>
inline unsigned inference_threads(unsigned hardware){return std::min(4u,std::max(1u,hardware));}
