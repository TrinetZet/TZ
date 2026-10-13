package com.trinetzet.taskcapture;
import org.junit.Test;
public class CoreSuiteTest {
 @Test public void modelFilesRecovery()throws Exception{ModelFilesTest.main(new String[0]);}
 @Test public void claimOwnership(){ClaimGuardTest.main(new String[0]);}
 @Test public void captureContract(){CoreTest.main(new String[0]);}
 @Test public void promptContract(){PromptTest.main(new String[0]);}
 @Test public void outputContract(){OutputTest.main(new String[0]);}
}
