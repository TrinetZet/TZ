using System;
using System.IO;
using System.Linq;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using System.Runtime.InteropServices;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Interop;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Threading;
using TaskCapture.Core;
using TaskCapture.Windows;
public static class Program {
 [STAThread]public static int Main(string[] args){if(args.Contains("--selection-host")){Host();return 0;}if(args.Contains("--fixture")){string path=args[Array.IndexOf(args,"--fixture")+1];using var store=new MarkdownStore(path);var t=store.Capture("Данные сохраняются после удаления TaskCapture");store.Complete(t.Id,0,new("Сохранить данные","Проверить сохранность MD."));SettingsStore.Save(new AppSettings(path));return 0;}var app=new Application{ShutdownMode=ShutdownMode.OnExplicitShutdown};app.Resources.MergedDictionaries.Add((ResourceDictionary)Application.LoadComponent(new Uri("/TaskCapture.Windows;component/Glass.xaml",UriKind.Relative)));int exit=1;app.Dispatcher.BeginInvoke(new Action(async()=>{try{if(args.Contains("--model-root"))await RunModel(args[Array.IndexOf(args,"--model-root")+1]);else await Run();exit=0;}catch(Exception e){Console.WriteLine(e);exit=1;}finally{app.Shutdown();}}));app.Run();return exit;}
 private static async Task RunModel(string root){
  Directory.CreateDirectory("qa-artifacts");var model=new OfflineModel(root);string[] sources=["Позвонить Кате завтра","Купить молоко по дороге домой","Проверить отчёт за сентябрь","Отправить команде обновлённое расписание","Согласовать время встречи с руководителем","Подготовить презентацию результатов проекта","Записаться на техническое обслуживание автомобиля","Проверить доступ к личному кабинету","Нужно узнать у преподавателя срок сдачи работы","Исходный текст 🐶 "+new string('я',700)];var results=new System.Collections.Generic.List<object>();
  for(int i=0;i<sources.Length;i++){var watch=Stopwatch.StartNew();var task=await model.NormalizeAsync(sources[i],CancellationToken.None);Check(!string.IsNullOrWhiteSpace(task.Title)&&!string.IsNullOrWhiteSpace(task.Description),"Actual model output empty");results.Add(new{input=i,title=task.Title,description=task.Description,milliseconds=watch.ElapsedMilliseconds});Console.WriteLine("PASS actual local model "+(i+1)+"/10");}
  File.WriteAllText("qa-artifacts/model-inference-report.json",System.Text.Json.JsonSerializer.Serialize(results,new System.Text.Json.JsonSerializerOptions{WriteIndented=true}));
 }
 private static async Task Run(){
  Directory.CreateDirectory("qa-artifacts");string root=Path.Combine(Path.GetTempPath(),"tc-win-"+Guid.NewGuid());Directory.CreateDirectory(root);
  try{
   var window=new Window{Width=200,Height=120,Title="Hotkey owner"};window.Show();var handle=new WindowInteropHelper(window).Handle;using(var hotkey=new HotkeyService(handle)){
    hotkey.Change("Ctrl+Shift+T");window.Hide();string? captured=null;Exception? failure=null;
    hotkey.Pressed+=async()=>{try{captured=await SelectionCapture.CaptureAsync();}catch(Exception e){failure=e;}};
    using var host=Process.Start(new ProcessStartInfo(Environment.ProcessPath!){UseShellExecute=false,ArgumentList={"--selection-host"}})!;
    try{await Until(()=>{host.Refresh();return host.MainWindowHandle!=IntPtr.Zero;},5000);NativeMethods.SetForegroundWindow(host.MainWindowHandle);await Task.Delay(200);Clipboard.SetText("STALE");Press();await Until(()=>captured!=null||failure!=null,5000);if(failure!=null)throw failure;Check(captured=="Позвонить Кате завтра 🐶","Hotkey did not capture selected text from foreign app");Console.WriteLine("PASS real global hotkey + selected text in separate process");
     Check(!NativeMethods.RegisterHotKey(handle,0x7777,6,84),"Conflict not detected");Check(NativeMethods.RegisterHotKey(handle,0x7778,3,121),"Cannot set foreign conflict");try{Throws<InvalidOperationException>(()=>hotkey.Change("Ctrl+Alt+F10"));}finally{NativeMethods.UnregisterHotKey(handle,0x7778);}Console.WriteLine("PASS conflicting hotkey rejected");
     captured=null;failure=null;NativeMethods.SetForegroundWindow(host.MainWindowHandle);Send(NativeMethods.Key(39),NativeMethods.Key(39,true));await Task.Delay(100);Clipboard.SetText("OLD CLIPBOARD");Press();await Until(()=>captured!=null||failure!=null,5000);Check(captured==null&&failure is InvalidOperationException,"No selection reused stale clipboard");Console.WriteLine("PASS no-selection never uses old clipboard");
    }finally{if(!host.HasExited)host.Kill(true);}
   }window.Close();
   string path=Path.Combine(root,"Задачи 🐶.md");using(var seed=new MarkdownStore(path)){var t=seed.Capture("Подготовить презентацию для команды");seed.Complete(t.Id,0,new("Подготовить презентацию","Собрать результаты проекта и показать следующие шаги команде."));var t2=seed.Capture("Позвонить Кате");seed.Complete(t2.Id,0,new("Согласовать расписание","Обсудить время занятий на следующую неделю."));seed.SetStage(t2.Id,"in_progress");var t3=seed.Capture("Проверить отчёт");seed.Complete(t3.Id,0,new("Проверить отчёт","Проверить результаты и финальные показатели."));seed.SetStage(t3.Id,"done");}
   var main=new MainWindow(new AppSettings(path,"Ctrl+Shift+T",false),new FakeModel());main.Show();await Task.Delay(600);main.UpdateLayout();Shot(main,"main");
   var doc=MarkdownCodec.Decode(File.ReadAllText(path));var original=doc.Tasks[0];var edit=new EditWindow(original,doc.Stages,main.Store!);edit.Show();await Task.Delay(200);((TextBox)edit.FindName("TitleBox")).Text="Ручной заголовок 🐶";((TextBox)edit.FindName("DescriptionBox")).Text="Ручное описание";((TextBox)edit.FindName("SourceBox")).Text="Исходник после редактирования";edit.UpdateLayout();Shot(edit,"edit");((Button)edit.FindName("SaveButton")).RaiseEvent(new RoutedEventArgs(Button.ClickEvent));Check(MarkdownCodec.Decode(File.ReadAllText(path)).Tasks[0].Title=="Ручной заголовок 🐶","UI edit not immediately on disk");Console.WriteLine("PASS editor writes title, description and source to MD");
   main.Width=780;main.Height=580;await Task.Delay(300);main.UpdateLayout();Check(((ScrollViewer)main.FindName("TaskScroll")).ViewportHeight>100,"Narrow layout loses task viewport");Shot(main,"narrow");Console.WriteLine("PASS narrow window retains task list");
   var setup=new SetupWindow(new AppSettings(path,"Ctrl+Shift+T"),doc.Stages);setup.Show();await Task.Delay(200);Shot(setup,"setup");setup.Close();
   var stages=new StageWindow(main.Store!);stages.Show();await Task.Delay(200);Shot(stages,"stages");stages.Close();
   var toast=new ToastWindow("Добавлено в бэклог","Текст сохранён",false);toast.Show();await Task.Delay(350);Shot(toast,"capture");toast.Close();
   main.Hide();using(var host=Process.Start(new ProcessStartInfo(Environment.ProcessPath!){UseShellExecute=false,ArgumentList={"--selection-host"}})!){try{await Until(()=>{host.Refresh();return host.MainWindowHandle!=IntPtr.Zero;},5000);NativeMethods.SetForegroundWindow(host.MainWindowHandle);await Task.Delay(200);Press();await Until(()=>MarkdownCodec.Decode(File.ReadAllText(path)).Tasks.Count==4,5000);Check(MarkdownCodec.Decode(File.ReadAllText(path)).Tasks.Last().Source=="Позвонить Кате завтра 🐶","Hidden capture lost source");Console.WriteLine("PASS capture works with task window hidden");}finally{if(!host.HasExited)host.Kill(true);}}
   await main.ExitAsync();Console.WriteLine("Windows integration: all checks passed");
  }finally{Directory.Delete(root,true);}
 }
 private static void Host(){System.Windows.Forms.Application.EnableVisualStyles();var form=new System.Windows.Forms.Form{Text="TaskCapture selection host",Width=600,Height=220};var box=new System.Windows.Forms.TextBox{Multiline=true,Dock=System.Windows.Forms.DockStyle.Fill,Text="Позвонить Кате завтра 🐶"};form.Controls.Add(box);form.Shown+=(_,_)=>{form.Activate();box.Focus();box.SelectAll();};System.Windows.Forms.Application.Run(form);}
 private static void Press()=>Send(NativeMethods.Key(17),NativeMethods.Key(16),NativeMethods.Key(84),NativeMethods.Key(84,true),NativeMethods.Key(16,true),NativeMethods.Key(17,true));
 private static void Send(params NativeMethods.Input[] inputs){Check(NativeMethods.SendInput((uint)inputs.Length,inputs,Marshal.SizeOf<NativeMethods.Input>())==inputs.Length,"SendInput failed");}
 private static async Task Until(Func<bool> condition,int milliseconds){var until=DateTime.UtcNow.AddMilliseconds(milliseconds);while(!condition()){if(DateTime.UtcNow>until)throw new Exception("Condition timed out");await Task.Delay(25);}}
 private static void Shot(Window w,string name){w.UpdateLayout();var image=new RenderTargetBitmap((int)w.ActualWidth,(int)w.ActualHeight,96,96,PixelFormats.Pbgra32);image.Render(w);var png=new PngBitmapEncoder();png.Frames.Add(BitmapFrame.Create(image));using var file=File.Create(Path.Combine("qa-artifacts",name+".png"));png.Save(file);}
 private static void Check(bool condition,string message){if(!condition)throw new Exception(message);}
 private static void Throws<T>(Action body)where T:Exception{try{body();}catch(T){return;}throw new Exception("Expected "+typeof(T).Name);}
 private sealed class FakeModel:IOfflineModel{public Task<NormalizedTask> NormalizeAsync(string source,CancellationToken ct)=>Task.FromResult(new NormalizedTask("Позвонить Кате","Уточнить время завтра."));}
}
