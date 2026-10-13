#include "engine.h"
#include <iostream>
int main(int argc,char **argv){if(argc!=3)return 2;try{std::cout<<extract_task(argv[1],argv[2]);return 0;}catch(const std::exception&){std::cerr<<"Inference failed";return 1;}}
