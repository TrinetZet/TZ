package com.trinetzet.taskcapture;
public class CoreTest {
  static void check(boolean v) { if (!v) throw new AssertionError(); }
  static void invalid(String action,String text) { try {CaptureInput.parse(action,text); throw new AssertionError("Accepted invalid input");} catch(IllegalArgumentException expected){} }
  public static void main(String[] args) {
    invalid("send", "ok"); invalid(CaptureInput.SEND,"  "); invalid(CaptureInput.PROCESS,"x".repeat(65537));
    check(CaptureInput.parse(CaptureInput.PROCESS,"  Позвонить Кате 🐶  ").equals("Позвонить Кате 🐶"));
    check(CaptureInput.parse(CaptureInput.SEND,"a".repeat(65536)).length()==65536);
    System.out.println("CaptureInput: 5 assertions passed");
  }
}
