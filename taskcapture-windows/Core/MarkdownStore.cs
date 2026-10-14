using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
namespace TaskCapture.Core;
public sealed class MarkdownStore:IDisposable
{
 public string Path {get;}
 private readonly IAtomicFileCommit committer;private readonly object gate=new();private readonly FileStream fileLock;private bool disposed;
 private static readonly UTF8Encoding Utf8=new(false,true);
 public MarkdownStore(string path,List<TaskStage>? stages=null,bool createIfMissing=true,IAtomicFileCommit? committer=null){
  this.committer=committer??new AtomicFileCommit();Path=System.IO.Path.GetFullPath(path);if(!Path.EndsWith(".md",StringComparison.OrdinalIgnoreCase))throw new ArgumentException("Выберите файл .md.");
  if(!createIfMissing&&!File.Exists(Path))throw new FileNotFoundException("Выбранный MD-файл не найден. Выберите существующий файл или явно создайте новый.",Path);
  Directory.CreateDirectory(System.IO.Path.GetDirectoryName(Path)!);fileLock=new FileStream(Path+".taskcapture.lock",FileMode.OpenOrCreate,FileAccess.ReadWrite,FileShare.None);
  try{if(!File.Exists(Path)){if(!createIfMissing)throw new FileNotFoundException("MD-файл был удалён.",Path);Write(new(stages??TaskDocument.DefaultStages(),[]),null);}else Read();}catch{fileLock.Dispose();throw;}
 }
 private (TaskDocument Document,string Hash) Load(){ObjectDisposedException.ThrowIf(disposed,this);if(!File.Exists(Path))throw new FileNotFoundException("Файл задач удалён или перемещён. Выберите его заново.",Path);var info=new FileInfo(Path);if(info.Length>100*1024*1024)throw new IOException("MD-файл превышает100МБ.");byte[] bytes=File.ReadAllBytes(Path);string text=Utf8.GetString(bytes);if(text.StartsWith('\uFEFF'))text=text[1..];return(MarkdownCodec.Decode(text),Hash(bytes));}
 public TaskDocument Read(){lock(gate)return Load().Document;}
 private static string Hash(byte[] data)=>Convert.ToHexString(SHA256.HashData(data));
 private void Write(TaskDocument document,string? expectedHash){
  byte[] bytes=Utf8.GetBytes(MarkdownCodec.Encode(document));string token=Guid.NewGuid().ToString("N"),temp=Path+"."+token+".tmp",backup=Path+".replaced-"+token+".md";
  try{
   using(var output=new FileStream(temp,FileMode.CreateNew,FileAccess.Write,FileShare.None)){output.Write(bytes);output.Flush(true);}
   if(expectedHash is null){File.Move(temp,Path,false);return;}
   if(!File.Exists(Path)||Hash(File.ReadAllBytes(Path))!=expectedHash)throw new StoreConflictException("MD изменился во время записи. Повторите действие.");
   // ReplaceFile creates the backup from the exact file replaced, not an earlier copy.
   committer.Replace(temp,Path,backup);
   if(Hash(File.ReadAllBytes(backup))!=expectedHash){
    if(File.Exists(Path)&&Hash(File.ReadAllBytes(Path))==Hash(bytes)){
     string attempted=Path+".conflict-taskcapture-"+token+".md";
     try{committer.Replace(backup,Path,attempted);}catch(IOException){PreserveAttempt(bytes,token);}
    }else{PreserveAttempt(bytes,token);}
    throw new StoreConflictException("MD одновременно изменён другим приложением. Вытесненная версия и попытка сохранения сохранены рядом в MD-файлах конфликтов. Повторите действие.");
   }
   if(!File.Exists(Path)||Hash(File.ReadAllBytes(Path))!=Hash(bytes)){
    PreserveAttempt(bytes,token);throw new StoreConflictException("MD изменён или удалён сразу после записи. Попытка сохранения сохранена в отдельном MD рядом; файл не создаётся заново автоматически.");
   }
   // If the conventional backup is protected, keep the uniquely named backup instead.
   try{File.Move(backup,Path+".bak",true);}catch(IOException){}catch(UnauthorizedAccessException){}
  }finally{if(File.Exists(temp))File.Delete(temp);}
 }
 private void PreserveAttempt(byte[] bytes,string token){string recovery=Path+".conflict-taskcapture-"+token+".md";if(!File.Exists(recovery)){using var stream=new FileStream(recovery,FileMode.CreateNew,FileAccess.Write,FileShare.None);stream.Write(bytes);stream.Flush(true);}}
 private void Change(Action<TaskDocument> action){lock(gate){var(d,hash)=Load();action(d);Write(d,hash);}}
 public TaskItem Capture(string source){if(string.IsNullOrWhiteSpace(source)||source.Length>65536||source.Contains('\0'))throw new ArgumentException("Выделите текст от1 до65536 символов.");string title=source.Split(['\r','\n'],StringSplitOptions.RemoveEmptyEntries).Select(line=>line.Trim()).First(line=>line.Length>0);if(title.Length>100)title=title[..(char.IsHighSurrogate(title[99])?99:100)];var task=new TaskItem(Guid.NewGuid().ToString("N"),title,"",source,"backlog",DateTimeOffset.UtcNow);Change(d=>d.Tasks.Add(task));return task;}
 public TaskItem Edit(string id,string expectedFingerprint,string title,string description,string source){TaskItem? result=null;Change(d=>{int i=Index(d,id);var old=d.Tasks[i];if(Fingerprint(old)!=expectedFingerprint)throw new StoreConflictException("Задача уже изменилась. Закройте и заново откройте редактор; введённый текст пока остаётся в окне.");MarkdownCodec.ValidateTexts(title,description,source);result=old with{Title=title.Trim(),Description=description,Source=source,ContentRevision=old.ContentRevision+1};d.Tasks[i]=result;});return result!;}
 public void SetStage(string id,string stageId)=>Change(d=>{if(!d.Stages.Any(s=>s.Id==stageId))throw new ArgumentException("Неизвестный этап.");int i=Index(d,id);d.Tasks[i]=d.Tasks[i] with{StageId=stageId};});
 public void ReplaceStages(List<TaskStage> stages)=>Change(d=>{MarkdownCodec.Validate(new(stages,d.Tasks));d.Stages.Clear();d.Stages.AddRange(stages);});
 public void Complete(TaskItem original,NormalizedTask normalized)=>Change(d=>{int i=Index(d,original.Id);var old=d.Tasks[i];bool unchanged=old.ContentRevision==original.ContentRevision&&old.Title==original.Title&&old.Description==original.Description&&old.Source==original.Source;d.Tasks[i]=unchanged?old with{Title=normalized.Title,Description=normalized.Description,Processing="ready",Error=""}:old with{Processing="ready",Error=""};});
 public void Fail(string id,string error)=>Change(d=>{int i=Index(d,id);d.Tasks[i]=d.Tasks[i] with{Processing="error",Error=error};});
 public void Retry(string id)=>Change(d=>{int i=Index(d,id);d.Tasks[i]=d.Tasks[i] with{Processing="pending",Error=""};});
 private static int Index(TaskDocument d,string id){int i=d.Tasks.FindIndex(t=>t.Id==id);if(i<0)throw new ArgumentException("Задача больше не существует.");return i;}
 public static string Fingerprint(TaskItem task)=>Hash(Utf8.GetBytes(JsonSerializer.Serialize(task)));
 public void Dispose(){lock(gate){if(disposed)return;disposed=true;fileLock.Dispose();}}
}
