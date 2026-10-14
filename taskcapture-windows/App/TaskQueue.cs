using TaskCapture.Core;
namespace TaskCapture.Windows;
public sealed class TaskQueue:IAsyncDisposable {
 private readonly MarkdownStore store;private readonly IOfflineModel model;private readonly CancellationTokenSource cancellation=new();private readonly SemaphoreSlim signal=new(0);private readonly Task worker;
 public event Action? Changed;public event Action<string>? Error;
 public TaskQueue(MarkdownStore store,IOfflineModel model){this.store=store;this.model=model;worker=Task.Run(Run);Wake();}
 public void Wake(){if(!cancellation.IsCancellationRequested&&signal.CurrentCount==0)signal.Release();}
 private async Task Run(){while(!cancellation.IsCancellationRequested){try{await signal.WaitAsync(cancellation.Token);while(!cancellation.IsCancellationRequested){TaskItem? task;try{task=store.Read().Tasks.FirstOrDefault(t=>t.Processing=="pending");}catch(Exception e){Error?.Invoke(e.Message);break;}if(task is null)break;
   try{var result=await model.NormalizeAsync(task.Source,cancellation.Token);cancellation.Token.ThrowIfCancellationRequested();store.Complete(task.Id,task.ContentRevision,result);Changed?.Invoke();}
   catch(OperationCanceledException)when(cancellation.IsCancellationRequested){return;}
   catch(Exception e){try{store.Fail(task.Id,e.Message);Changed?.Invoke();}catch(Exception disk){Error?.Invoke(disk.Message);break;}}
  }}catch(OperationCanceledException)when(cancellation.IsCancellationRequested){return;}}}
 public async ValueTask DisposeAsync(){cancellation.Cancel();await worker;signal.Dispose();cancellation.Dispose();}
}
