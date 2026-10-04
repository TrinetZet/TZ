package com.trinetzet.clientbridge;
import org.junit.Test;
import static org.junit.Assert.*;
public class BridgePolicyTest {
 @Test public void onlyPackagedNavigationIsTrusted() {
  assertTrue(BridgePolicy.isTrusted("https://appassets.androidplatform.net/assets/clientbridge/index.html#practice"));
  assertFalse(BridgePolicy.isTrusted("https://evil.example/assets/clientbridge/index.html"));
  assertFalse(BridgePolicy.isTrusted("file:///sdcard/test.html"));
  assertFalse(BridgePolicy.isTrusted("https://appassets.androidplatform.net.evil.example/assets/clientbridge/index.html"));
  assertFalse(BridgePolicy.isTrusted("https://appassets.androidplatform.net/assets/clientbridge/other.html"));
 }
 @Test public void exportNamesCannotEscapeOrSpoofPayloads() {
  assertEquals("clientbridge-progress.json", BridgePolicy.exportName("clientbridge-progress.json"));
  assertEquals("clientbridge-email.txt", BridgePolicy.exportName("../../private/key.txt"));
  assertEquals("clientbridge-email.txt", BridgePolicy.exportName("evil.apk"));
  assertTrue(BridgePolicy.validText("Dear Alex"));
  assertFalse(BridgePolicy.validText("x".repeat(1000001)));
 }
}
