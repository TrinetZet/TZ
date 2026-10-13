package com.trinetzet.taskcapture;
public final class ClaimGuard {
 public static boolean allowed(String owner,String current){return owner!=null&&!owner.isEmpty()&&owner.equals(current);}
}
