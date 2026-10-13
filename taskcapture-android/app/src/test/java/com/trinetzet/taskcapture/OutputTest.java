package com.trinetzet.taskcapture;
public class OutputTest {
 static void check(boolean v) {if(!v)throw new AssertionError();}
 static void invalid(String j) {try {OutputValidator.parse(j);throw new AssertionError("Accepted invalid JSON");}catch(IllegalArgumentException ok){}}
 public static void main(String[] args) {
  invalid("");invalid("{\"title\":\"\",\"description\":\"x\"}");
  invalid("{\"title\":\"ok\",\"description\":\"ok\",\"extra\":1}");
  invalid("{\"title\":123,\"description\":\"ok\"}");
  invalid("{\"title\":\""+ "x".repeat(161)+"\",\"description\":\"ok\"}");
  invalid("{\"title\":\"ok\",\"description\":\""+ "x".repeat(4097)+"\"}");
  invalid("{\"title\":\"ok\",\"description\":\"ok\"} garbage");
  NormalizedTask r=OutputValidator.parse("{\"title\":\"Позвонить Кате 🐶\",\"description\":\"Проверить план\"}");
  check(r.title.equals("Позвонить Кате 🐶"));
  check(r.description.equals("Проверить план"));
  System.out.println("OutputValidator: 9 assertions passed");
 }
}
