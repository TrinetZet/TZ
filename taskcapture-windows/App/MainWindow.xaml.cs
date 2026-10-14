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
 private AppSettings? settings;private readonly IOfflineModel model;private HotkeyService? hotkey;private TaskQueue? queue;private TrayService? tray;private readonly DispatcherTimer timer;private string signature="",selectedStage="all";private bool exiting,busy,configuring;private string? runtimeError;private List<TaskStage> lastStages=TaskDocument.DefaultStages();
 public MainWindow(AppSettings? initial=null,IOfflineModel? model=null){InitializeComponent();this.model=model??new OfflineModel();try{settings=initial??SettingsStore.Load();if(settings is not null)OpenStore(settings);}catch(Exception ex){runtimeError=ex.Message;MessageLabel.Text=ex.Message;}SourceInitialized+=(_,_)=>{Motion.Backdrop(this);hotkey=new HotkeyService(new WindowInteropHelper(this).Handle);hotkey.Pressed+=CapturePressed;try{if(settings is not null)hotkey.Change(settings.Hotkey);}catch(Exception e){runtimeError=e.Message;MessageLabel.Text=e.Message;}tray=new TrayService(this);};Loaded+=(_,_)=>{Refresh();Motion.Appear((FrameworkElement)Content);if(settings is null)Dispatcher.BeginInvoke(new Action(Configure));};timer=new DispatcherTimer{Interval=TimeSpan.FromSeconds(2)};timer.Tick+=(_,_)=>{Refresh();queue?.Wake();};timer.Start();}
 private void OpenStore(AppSettings config){Store=new MarkdownStore(config.MarkdownPath,createIfMissing:false);ConnectQueue();}
 private void ConnectQueue(){queue=new TaskQueue(Store!,model);queue.Changed+=()=>Dispatcher.BeginInvoke(new Action(Refresh));queue.Error+=message=>Dispatcher.BeginInvoke(new Action(()=>MessageLabel.Text=message));}
 private void Refresh(){try{if(Store is null){EmptyLabel.Text="Выберите MD-файл в настройках";PathLabel.Text=settings?.MarkdownPath;MessageLabel.Text=runtimeError??"Начните с настройки TaskCapture.";return;}var document=Store.Read();lastStages=document.Stages.ToList();string next=JsonSerializer.Serialize(document);if(next==signature)return;signature=next;double y=TaskScroll.VerticalOffset;
  var filters=new List<FilterRow>{new("all","Все задачи",document.Tasks.Count)};filters.AddRange(document.Stages.Select(s=>new FilterRow(s.Id,s.Name,document.Tasks.Count(t=>t.StageId==s.Id))));if(!filters.Any(f=>f.Id==selectedStage))selectedStage="all";StageFilters.ItemsSource=filters;StageFilters.SelectedItem=filters.Single(f=>f.Id==selectedStage);
  TaskList.ItemsSource=document.Tasks.Where(t=>selectedStage=="all"||t.StageId==selectedStage).OrderByDescending(t=>t.CreatedUtc).Select(t=>new CardRow(t,document.Stages)).ToList();EmptyLabel.Visibility=TaskList.Items.Count==0?Visibility.Visible:Visibility.Collapsed;EmptyLabel.Text="Выдели текст в любом приложении\nи нажми "+settings?.Hotkey;SummaryLabel.Text=$"{document.Tasks.Count} задач · {document.Tasks.Count(t=>document.Stages.Single(s=>s.Id==t.StageId).IsDone)} выполнено";HotkeyLabel.Text=hotkey?.CurrentCombination??"Не активна";PathLabel.Text=Store.Path;PathLabel.ToolTip=Store.Path;HintLabel.Text="Выдели текст → "+settings?.Hotkey+" → задача в бэклоге";MessageLabel.Text=runtimeError??"Изменения сохраняются в MD сразу. Модель работает на этом компьютере.";Dispatcher.BeginInvoke(new Action(()=>TaskScroll.ScrollToVerticalOffset(y)),DispatcherPriority.Loaded);
 }catch(Exception e){MessageLabel.Text=e.Message;}}
 private void Filter_Changed(object sender,SelectionChangedEventArgs e){if(StageFilters.SelectedItem is FilterRow f&&f.Id!=selectedStage){selectedStage=f.Id;signature="";Refresh();}}
 private void Card_Loaded(object sender,RoutedEventArgs e)=>Motion.Appear((FrameworkElement)sender);
 private void TaskStage_Changed(object sender,SelectionChangedEventArgs e){if(sender is not ComboBox box||box.DataContext is not CardRow row||box.SelectedValue is not string stage||stage==row.StageId)return;try{Store!.SetStage(row.Task.Id,stage);Refresh();new ToastWindow("Статус обновлён","Изменения сохранены в MD",false).ShowTimed();}catch(Exception ex){MessageLabel.Text=ex.Message;signature="";Refresh();}}
 private void Edit_Click(object sender,RoutedEventArgs e){if((sender as FrameworkElement)?.DataContext is not CardRow row)return;try{var d=Store!.Read();var current=d.Tasks.Single(t=>t.Id==row.Task.Id);var editor=new EditWindow(current,d.Stages,Store){Owner=this};editor.ShowDialog();if(editor.Saved)Refresh();}catch(Exception ex){MessageLabel.Text=ex.Message;}}
 private void Retry_Click(object sender,RoutedEventArgs e){if((sender as FrameworkElement)?.DataContext is not CardRow row)return;try{Store!.Retry(row.Task.Id);queue?.Wake();Refresh();}catch(Exception ex){MessageLabel.Text=ex.Message;}}
 private async void CapturePressed(){if(busy||configuring)return;if(Store is null){new ToastWindow("Сначала настройте TaskCapture","Выберите MD-файл и горячую клавишу",true).ShowTimed();return;}busy=true;try{string source=await SelectionCapture.CaptureAsync();Store.Capture(source);queue!.Wake();Refresh();new ToastWindow("Добавлено в бэклог","Текст сохранён",false).ShowTimed();}catch(Exception e){new ToastWindow("Не удалось создать задачу",e.Message,true).ShowTimed();}finally{busy=false;}}
 private void Stages_Click(object sender,RoutedEventArgs e){try{if(Store is null){Configure();return;}var form=new StageWindow(Store){Owner=this};form.ShowDialog();if(form.Saved)Refresh();}catch(Exception ex){MessageLabel.Text=ex.Message;}}
 private void Settings_Click(object sender,RoutedEventArgs e)=>Configure();
 private List<TaskStage> SafeStages(){try{return Store?.Read().Stages??lastStages;}catch{return lastStages;}}
 private async void Configure(){if(configuring)return;configuring=true;try{var form=new SetupWindow(settings,SafeStages()){Owner=this};if(form.ShowDialog()!=true)return;await ApplySettingsAsync(form.Result!,form.ProposedStages,form.AllowCreate);new ToastWindow("Настройки сохранены",settings!.Hotkey+" · MD выбран",false).ShowTimed();}catch(Exception e){MessageLabel.Text=e.Message;}finally{configuring=false;}}
 public async Task ApplySettingsAsync(AppSettings next,List<TaskStage> stages,bool allowCreate=false){
  var previous=settings;var previousStore=Store;var previousQueue=queue;MarkdownStore? candidate=null;bool same=Store is not null&&string.Equals(Store.Path,System.IO.Path.GetFullPath(next.MarkdownPath),StringComparison.OrdinalIgnoreCase);bool stagesChanged=false,settingsSaved=false,retired=false;List<TaskStage>? previousStages=null;
  try{
   if(same&&allowCreate&&!File.Exists(next.MarkdownPath)){if(previousQueue is not null)await previousQueue.DisposeAsync();previousStore!.Dispose();Store=null;queue=null;previousStore=null;previousQueue=null;same=false;}
   candidate=same?Store:new MarkdownStore(next.MarkdownPath,stages,allowCreate);var document=candidate!.Read();MarkdownCodec.Validate(new(stages,document.Tasks));previousStages=document.Stages.ToList();
   hotkey!.Change(next.Hotkey);
   if(JsonSerializer.Serialize(stages)!=JsonSerializer.Serialize(document.Stages)){candidate.ReplaceStages(stages);stagesChanged=true;}
   SettingsStore.Save(next);settingsSaved=true;
   if(previousQueue is not null){retired=true;await previousQueue.DisposeAsync();}
   Store=candidate;candidate=null;queue=null;settings=next;runtimeError=null;if(!same)previousStore?.Dispose();ConnectQueue();signature="";Refresh();
   try{SettingsStore.SetAutostart(next.StartOnLogin);}catch(Exception ex){MessageLabel.Text="Настройки сохранены, но автозапуск не изменён: "+ex.Message;}
  }catch{
   if(stagesChanged&&same&&previousStore is not null&&previousStages is not null)try{previousStore.ReplaceStages(previousStages);}catch(Exception ex){runtimeError="Не удалось восстановить прежние этапы: "+ex.Message;}
   if(settingsSaved&&previous is not null)try{SettingsStore.Save(previous);}catch(Exception ex){runtimeError="Не удалось восстановить прежний путь в настройках: "+ex.Message;}
   try{if(previous is not null)hotkey!.Change(previous.Hotkey);else hotkey!.Disable();}catch(Exception ex){hotkey!.Disable();runtimeError="Прежняя клавиша теперь занята. Выберите новое сочетание: "+ex.Message;}
   Store=previousStore;settings=previous;queue=previousQueue;if(retired&&Store is not null)ConnectQueue();signature="";Refresh();throw;
  }finally{if(candidate is not null&&!same)candidate.Dispose();}
 }
 private void OpenFile_Click(object sender,RoutedEventArgs e){try{if(Store is not null)Process.Start(new ProcessStartInfo(Store.Path){UseShellExecute=true});}catch(Exception ex){MessageLabel.Text=ex.Message;}}
 private void Window_Closing(object? sender,CancelEventArgs e){if(!exiting){e.Cancel=true;Hide();}}
 public async Task ExitAsync(){if(exiting)return;exiting=true;timer.Stop();hotkey?.Dispose();tray?.Dispose();if(queue is not null)await queue.DisposeAsync();Store?.Dispose();Close();if(Application.Current.MainWindow==this)Application.Current.Shutdown();}
 public void ShowFromTray(){Show();WindowState=WindowState.Normal;Activate();}
 public sealed record FilterRow(string Id,string Name,int Count);
 public sealed record CardRow(TaskItem Task,List<TaskStage> Stages){public string Title=>Task.Title;public string Description=>Task.Description;public string StageId=>Task.StageId;public string ProcessingLabel=>Task.Processing switch{"pending"=>"Формируется локальной моделью…","error"=>Task.Error,_=>"Обработано · "+Task.CreatedUtc.ToLocalTime().ToString("dd.MM HH:mm")};public Visibility RetryVisibility=>Task.Processing=="error"?Visibility.Visible:Visibility.Collapsed;}
}
