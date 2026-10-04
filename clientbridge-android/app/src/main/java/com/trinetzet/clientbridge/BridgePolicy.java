package com.trinetzet.clientbridge;
import java.net.URI;
import java.nio.charset.StandardCharsets;
final class BridgePolicy {
 static final String HOME="https://appassets.androidplatform.net/assets/clientbridge/index.html";
 static boolean isTrusted(String url) {
  try { URI u=URI.create(url); return "https".equals(u.getScheme()) && "appassets.androidplatform.net".equals(u.getHost()) && u.getPort()==-1 && u.getUserInfo()==null && u.getQuery()==null && "/assets/clientbridge/index.html".equals(u.getPath()); } catch(Exception e){return false;}
 }
 static boolean validText(String text){return text!=null && text.getBytes(StandardCharsets.UTF_8).length<=1000000;}
 static String exportName(String name){return name!=null && name.matches("clientbridge-[a-z0-9-]+\\.txt|clientbridge-progress\\.json") ? name : "clientbridge-email.txt";}
}
