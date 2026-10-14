#include "engine.h"
#include <windows.h>
#include <iostream>
#include <iterator>
#include <string>
#include <stdexcept>
std::string utf8(const wchar_t* text){int size=WideCharToMultiByte(CP_UTF8,0,text,-1,nullptr,0,nullptr,nullptr);if(size<=0)throw std::runtime_error("path");std::string value(size,'\0');WideCharToMultiByte(CP_UTF8,0,text,-1,value.data(),size,nullptr,nullptr);value.pop_back();return value;}
int wmain(int argc,wchar_t** argv){if(argc!=2)return 2;try{std::string prompt((std::istreambuf_iterator<char>(std::cin)),std::istreambuf_iterator<char>());if(prompt.empty()||prompt.size()>16384)return 2;std::cout<<extract_task(utf8(argv[1]),prompt);return 0;}catch(const std::exception&){std::cerr<<"Inference failed";return 1;}}
