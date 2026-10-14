using System.ComponentModel;
using System.Diagnostics;
using System.Text.Json;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Interop;
using System.Windows.Threading;
using TaskCapture.Core;
namespace TaskCapture.Windows;
public partial class MainWindow:Window {
 public MarkdownStore? Store{get;private set;}
 private AppSettings? settings;private readonly IOfflineModel model;private HotkeyService? hotkey;private TaskQueue? queue;private TrayService? tray;private readonly DispatcherTimer timer;private string signature="",selectedStage="all";private bool exiting,busy,configuring;
 public MainWindow(AppSettings? initial=null,IOfflineModel? model=null){InitializeComponent();this.model=model??new OfflineModel();settings=initial??SettingsStore.Load();if(settings is not null)OpenStore(settings);SourceInitialized+=(_,_)=>{Motion.Backdrop(this);hotkey=new HotkeyService(new WindowInteropHelper(this).Handle);hotkey.Pressed+=CapturePressed;try{if(settings is not null)hotkey.Change(settings.Hotkey);}catch(Exception e){MessageLabel.Text=e.Message;}tray=new TrayService(this);};Loaded+=(_,_)=>{Refresh();Motion.Appear((FrameworkElement)Content);if(settings is null)Dispatcher.BeginInvoke(new Action(Configure));};timer=new DispatcherTimer{Interval=TimeSpan.FromSeconds(2)};timer.Tick+=(_,_)=>{Refresh();queue?.Wake();};timer.Start();}
 private void OpenStore(AppSettings config){Store=new MarkdownStore(config.MarkdownPath);ConnectQueue();}
 private void ConnectQueue(){queue=new TaskQueue(Store!,model);queue.Changed+=()=>Dispatcher.BeginInvoke(new Action(Refresh));queue.Error+=message=>Dispatcher.BeginInvoke(new Action(()=>MessageLabel.Text=message));}
 private void Refresh(){try{if(Store is null)return;var document=Store.Read();string next=JsonSerializer.Serialize(document);if(next==signature)return;signature=next;double y=TaskScroll.VerticalOffset;
  var filters=new List<FilterRow>{new("all","Все задачи",document.Tasks.Count)};filters.AddRange(document.Stages.Select(s=>new FilterRow(s.Id,s.Name,document.Tasks.Count(t=>t.StageId==s.Id))));if(!filters.Any(f=>f.Id==selectedStage))selectedStage="all";StageFilters.ItemsSource=filters;StageFilters.SelectedItem=filters.Single(f=>f.Id==selectedStage);
  TaskList.ItemsSource=document.Tasks.Where(t=>selectedStage=="all"||t.StageId==selectedStage).OrderByDescending(t=>t.CreatedUtc).Select(t=>new CardRow(t,document.Stages)).ToList();EmptyLabel.Visibility=TaskList.Items.Count==0?Visibility.Visible:Visibility.Collapsed;EmptyLabel.Text="Выдели текст в любом приложении\nи нажми "+settings?.Hotkey;SummaryLabel.Text=$"{document.Tasks.Count} задач · {document.Tasks.Count(t=>document.Stages.Single(s=>s.Id==t.StageId).IsDone)} выполнено";HotkeyLabel.Text=settings?.Hotkey;PathLabel.Text=Store.Path;PathLabel.ToolTip=Store.Path;HintLabel.Text="Выдели текст → "+settings?.Hotkey+" → задача в бэклоге";MessageLabel.Text="Изменения сохраняются в MD сразу. Модель работает на этом компьютере.";Dispatcher.BeginInvoke(new Action(()=>TaskScroll.ScrollToVerticalOffset(y)),DispatcherPriority.Loaded);
 }catch(Exception e){MessageLabel.Text=e.Message;}}
 private void Filter_Changed(object sender,SelectionChangedEventArgs e){if(StageFilters.SelectedItem is FilterRow f&&f.Id!=selectedStage){selectedStage=f.Id;signature="";Refresh();}}
 private void Card_Loaded(object sender,RoutedEventArgs e)=>Motion.Appear((FrameworkElement)sender);
 private void TaskStage_Changed(object sender,SelectionChangedEventArgs e){if(sender is not ComboBox box||box.DataContext is not CardRow row||box.SelectedValue is not string stage||stage==row.StageId)return;try{Store!.SetStage(row.Task.Id,stage);Refresh();new ToastWindow("Статус обновлён","Изменения сохранены в MD",false).ShowTimed();}catch(Exception ex){MessageLabel.Text=ex.Message;signature="";Refresh();}}
 private void Edit_Click(object sender,RoutedEventArgs e){if((sender as FrameworkElement)?.DataContext is not CardRow row)return;try{var d=Store!.Read();var current=d.Tasks.Single(t=>t.Id==row.Task.Id);var editor=new EditWindow(current,d.Stages,Store){Owner=this};editor.ShowDialog();if(editor.Saved)Refresh();}catch(Exception ex){MessageLabel.Text=ex.Message;}}
 private void Retry_Click(object sender,RoutedEventArgs e){if((sender as FrameworkElement)?.DataContext is not CardRow row)return;try{Store!.Retry(row.Task.Id);queue?.Wake();Refresh();}catch(Exception ex){MessageLabel.Text=ex.Message;}}
 private async void CapturePressed(){if(busy||configuring)return;if(Store is null){new ToastWindow("Сначала настройте TaskCapture","Выберите MD-файл и горячую клавишу",true).ShowTimed();return;}busy=true;try{string source=await SelectionCapture.CaptureAsync();Store.Capture(source);queue!.Wake();Refresh();new ToastWindow("Добавлено в бэклог","Текст сохранён",false).ShowTimed();}catch(Exception e){new ToastWindow("Не удалось создать задачу",e.Message,true).ShowTimed();}finally{busy=false;}}
 private void Stages_Click(object sender,RoutedEventArgs e){try{if(Store is null){Configure();return;}var form=new StageWindow(Store){Owner=this};form.ShowDialog();if(form.Saved)Refresh();}catch(Exception ex){MessageLabel.Text=ex.Message;}}
 private void Settings_Click(object sender,RoutedEventArgs e)=>Configure();
 private async void Configure(){if(configuring)return;configuring=true;try{
  var form=new SetupWindow(settings,Store?.Read().Stages){Owner=this};if(form.ShowDialog()!=true)return;var next=form.Result!;MarkdownStore? candidate=null;bool same=Store is not null&&string.Equals(Store.Path,System.IO.Path.GetFullPath(next.MarkdownPath),StringComparison.OrdinalIgnoreCase);try{
   candidate=same?Store:new MarkdownStore(next.MarkdownPath,form.ProposedStages);MarkdownCodec.Validate(new(form.ProposedStages,candidate!.Read().Tasks));hotkey!.Change(next.Hotkey);
   try{SettingsStore.Save(next);}catch{if(settings is not null)hotkey.Change(settings.Hotkey);throw;}
   if(queue is not null)await queue.DisposeAsync();if(!same)Store?.Dispose();Store=candidate;candidate=null;Store!.ReplaceStages(form.ProposedStages);settings=next;ConnectQueue();signature="";Refresh();SettingsStore.SetAutostart(next.StartOnLogin);new ToastWindow("Настройки сохранены",next.Hotkey+" · MD выбран",false).ShowTimed();
  }finally{if(candidate is not null&&!same)candidate.Dispose();}
 }catch(Exception e){MessageLabel.Text=e.Message;}finally{configuring=false;}}
 private void OpenFile_Click(object sender,RoutedEventArgs e){try{if(Store is not null)Process.Start(new ProcessStartInfo(Store.Path){UseShellExecute=true});}catch(Exception ex){MessageLabel.Text=ex.Message;}}
 private void Window_Closing(object? sender,CancelEventArgs e){if(!exiting){e.Cancel=true;Hide();}}
 public async Task ExitAsync(){if(exiting)return;exiting=true;timer.Stop();hotkey?.Dispose();tray?.Dispose();if(queue is not null)await queue.DisposeAsync();Store?.Dispose();Close();if(Application.Current.MainWindow==this)Application.Current.Shutdown();}
 public void ShowFromTray(){Show();WindowState=WindowState.Normal;Activate();}
 public sealed record FilterRow(string Id,string Name,int Count);
 public sealed record CardRow(TaskItem Task,List<TaskStage> Stages){public string Title=>Task.Title;public string Description=>Task.Description;public string StageId=>Task.StageId;public string ProcessingLabel=>Task.Processing switch{"pending"=>"Формируется локальной моделью…","error"=>Task.Error,_=>"Обработано · "+Task.CreatedUtc.ToLocalTime().ToString("dd.MM HH:mm")};public Visibility RetryVisibility=>Task.Processing=="error"?Visibility.Visible:Visibility.Collapsed;}
}
