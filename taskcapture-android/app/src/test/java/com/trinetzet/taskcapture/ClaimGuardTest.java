package com.trinetzet.taskcapture;
public class ClaimGuardTest {
 public static void main(String[] args){
  if(ClaimGuard.allowed("old","replacement"))throw new AssertionError("Stale claim may overwrite replacement");
  if(ClaimGuard.allowed("",""))throw new AssertionError("Unclaimed task may complete");
  if(!ClaimGuard.allowed("active","active"))throw new AssertionError("Valid claim rejected");
  System.out.println("ClaimGuard: 3 ownership assertions passed");
 }
}
