namespace TaskCapture.Core;
public interface IAtomicFileCommit{void Replace(string prepared,string target,string backup);}
public sealed class AtomicFileCommit:IAtomicFileCommit{public void Replace(string prepared,string target,string backup)=>File.Replace(prepared,target,backup,true);}
