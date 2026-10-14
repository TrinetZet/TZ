using System.Diagnostics;
using System.Security.Cryptography;
using System.Text;
using TaskCapture.Core;
namespace TaskCapture.Windows;
public interface IOfflineModel{Task<NormalizedTask> NormalizeAsync(string source,CancellationToken cancellation);}
public sealed class OfflineModel:IOfflineModel {
 private readonly string root;
 public OfflineModel(string? root=null){this.root=root??AppContext.BaseDirectory;}
 public async Task<NormalizedTask> NormalizeAsync(string source,CancellationToken cancellation){
  string model=System.IO.Path.Combine(root,"runtime","model.gguf"),worker=System.IO.Path.Combine(root,"runtime","taskcapture-worker.exe");
  if(!File.Exists(model)||!File.Exists(worker))throw new IOException("Файлы локальной модели отсутствуют. Переустановите приложение.");
  await using(var file=File.OpenRead(model)){if(file.Length!=396705472||Convert.ToHexString(await SHA256.HashDataAsync(file,cancellation)).ToLowerInvariant()!="ac2d97712095a558e31573f62f466a3f9d93990898b0ec79d7c974c1780d524a")throw new IOException("Контрольная сумма модели не совпала. Переустановите приложение.");}
  using var timeout=CancellationTokenSource.CreateLinkedTokenSource(cancellation);timeout.CancelAfter(TimeSpan.FromSeconds(310));var start=new ProcessStartInfo(worker){UseShellExecute=false,CreateNoWindow=true,RedirectStandardInput=true,RedirectStandardOutput=true,RedirectStandardError=true,StandardInputEncoding=new UTF8Encoding(false),StandardOutputEncoding=Encoding.UTF8,StandardErrorEncoding=Encoding.UTF8};start.ArgumentList.Add(model);
  using var process=new Process{StartInfo=start};process.Start();try{
   var output=process.StandardOutput.ReadToEndAsync(timeout.Token);var error=process.StandardError.ReadToEndAsync(timeout.Token);
   await process.StandardInput.WriteAsync(PromptBuilder.Build(source).AsMemory(),timeout.Token);process.StandardInput.Close();await process.WaitForExitAsync(timeout.Token);string json=await output;await error;if(process.ExitCode!=0)throw new IOException("Локальная модель не смогла обработать текст. Исходник сохранён; можно повторить.");return OutputValidator.Parse(json);
  }catch(OperationCanceledException)when(!cancellation.IsCancellationRequested){throw new IOException("Обработка заняла более5 минут. Исходник сохранён.");}finally{if(!process.HasExited)process.Kill(true);}
 }
}
