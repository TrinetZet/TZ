#include "thread_config.h"
int main(){return inference_threads(0)==1&&inference_threads(1)==1&&inference_threads(2)==2&&inference_threads(8)==4?0:1;}
