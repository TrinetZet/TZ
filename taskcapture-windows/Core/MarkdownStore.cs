using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
namespace TaskCapture.Core;
public sealed class MarkdownStore:IDisposable
{
 public string Path {get;}
 private readonly object gate=new();private readonly FileStream fileLock;private bool disposed;
 private static readonly UTF8Encoding Utf8=new(false,true);
 public MarkdownStore(string path,List<TaskStage>? stages=null){
  Path=System.IO.Path.GetFullPath(path);if(!Path.EndsWith(".md",StringComparison.OrdinalIgnoreCase))throw new ArgumentException("Выберите файл .md.");Directory.CreateDirectory(System.IO.Path.GetDirectoryName(Path)!);
  fileLock=new FileStream(Path+".taskcapture.lock",FileMode.OpenOrCreate,FileAccess.ReadWrite,FileShare.None);
  try{if(!File.Exists(Path))Write(new(stages??TaskDocument.DefaultStages(),[]),null);else Read();}catch{fileLock.Dispose();throw;}
 }
 private (TaskDocument Document,string Hash) Load(){ObjectDisposedException.ThrowIf(disposed,this);if(!File.Exists(Path))throw new FileNotFoundException("Файл задач удалён или перемещён. Выберите его заново.",Path);var info=new FileInfo(Path);if(info.Length>100*1024*1024)throw new IOException("MD-файл превышает100МБ.");byte[] bytes=File.ReadAllBytes(Path);string text=Utf8.GetString(bytes);if(text.StartsWith('\uFEFF'))text=text[1..];return(MarkdownCodec.Decode(text),Hash(bytes));}
 public TaskDocument Read(){lock(gate)return Load().Document;}
 private static string Hash(byte[] data)=>Convert.ToHexString(SHA256.HashData(data));
 private void Write(TaskDocument document,string? expectedHash){
  byte[] bytes=Utf8.GetBytes(MarkdownCodec.Encode(document));string temp=Path+"."+Guid.NewGuid().ToString("N")+".tmp";
  try{
   using(var output=new FileStream(temp,FileMode.CreateNew,FileAccess.Write,FileShare.None)){output.Write(bytes);output.Flush(true);}
   if(expectedHash is not null){if(!File.Exists(Path)||Hash(File.ReadAllBytes(Path))!=expectedHash)throw new StoreConflictException("MD изменился во время записи. Повторите действие.");File.Copy(Path,Path+".bak",true);if(Hash(File.ReadAllBytes(Path))!=expectedHash)throw new StoreConflictException("MD изменён другим приложением.");File.Move(temp,Path,true);}
   else File.Move(temp,Path,false);
  }finally{if(File.Exists(temp))File.Delete(temp);}
 }
 private void Change(Action<TaskDocument> action){lock(gate){var(d,hash)=Load();action(d);Write(d,hash);}}
 public TaskItem Capture(string source){if(string.IsNullOrWhiteSpace(source)||source.Length>65536||source.Contains('\0'))throw new ArgumentException("Выделите текст от1 до65536 символов.");string title=source.Split(['\r','\n'],StringSplitOptions.RemoveEmptyEntries)[0];if(title.Length>100)title=title[..100];var task=new TaskItem(Guid.NewGuid().ToString("N"),title,"",source,"backlog",DateTimeOffset.UtcNow);Change(d=>d.Tasks.Add(task));return task;}
 public TaskItem Edit(string id,string expectedFingerprint,string title,string description,string source){TaskItem? result=null;Change(d=>{int i=Index(d,id);var old=d.Tasks[i];if(Fingerprint(old)!=expectedFingerprint)throw new StoreConflictException("Задача уже изменилась. Закройте и заново откройте редактор; введённый текст пока остаётся в окне.");MarkdownCodec.ValidateTexts(title,description,source);result=old with{Title=title.Trim(),Description=description,Source=source,ContentRevision=old.ContentRevision+1};d.Tasks[i]=result;});return result!;}
 public void SetStage(string id,string stageId)=>Change(d=>{if(!d.Stages.Any(s=>s.Id==stageId))throw new ArgumentException("Неизвестный этап.");int i=Index(d,id);d.Tasks[i]=d.Tasks[i] with{StageId=stageId};});
 public void ReplaceStages(List<TaskStage> stages)=>Change(d=>{MarkdownCodec.Validate(new(stages,d.Tasks));d.Stages.Clear();d.Stages.AddRange(stages);});
 public void Complete(string id,int revision,NormalizedTask normalized)=>Change(d=>{int i=Index(d,id);var old=d.Tasks[i];d.Tasks[i]=old.ContentRevision==revision?old with{Title=normalized.Title,Description=normalized.Description,Processing="ready",Error=""}:old with{Processing="ready",Error=""};});
 public void Fail(string id,string error)=>Change(d=>{int i=Index(d,id);d.Tasks[i]=d.Tasks[i] with{Processing="error",Error=error};});
 public void Retry(string id)=>Change(d=>{int i=Index(d,id);d.Tasks[i]=d.Tasks[i] with{Processing="pending",Error=""};});
 private static int Index(TaskDocument d,string id){int i=d.Tasks.FindIndex(t=>t.Id==id);if(i<0)throw new ArgumentException("Задача больше не существует.");return i;}
 public static string Fingerprint(TaskItem task)=>Hash(Utf8.GetBytes(JsonSerializer.Serialize(task)));
 public void Dispose(){lock(gate){if(disposed)return;disposed=true;fileLock.Dispose();}}
}
