#pragma once
#include <chrono>
struct Deadline {
 explicit Deadline(int milliseconds=120000):until(std::chrono::steady_clock::now()+std::chrono::milliseconds(milliseconds)){}
 bool expired()const{return std::chrono::steady_clock::now()>=until;}
 std::chrono::steady_clock::time_point until;
};
