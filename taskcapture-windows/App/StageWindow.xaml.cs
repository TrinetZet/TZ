using System.Collections.ObjectModel;
using System.Windows;
using TaskCapture.Core;
namespace TaskCapture.Windows;
public partial class StageWindow:Window {
 private readonly MarkdownStore store;private readonly ObservableCollection<Draft> rows=[];public bool Saved{get;private set;}
 public StageWindow(MarkdownStore store){InitializeComponent();this.store=store;foreach(var s in store.Read().Stages)rows.Add(new(){Id=s.Id,Name=s.Name,IsDone=s.IsDone});StageList.ItemsSource=rows;SourceInitialized+=(_,_)=>Motion.Backdrop(this);Loaded+=(_,_)=>Motion.Appear((FrameworkElement)Content);}
 private void Add_Click(object sender,RoutedEventArgs e)=>rows.Add(new(){Id=Guid.NewGuid().ToString("N"),Name="Новый этап"});
 private void Delete_Click(object sender,RoutedEventArgs e){if((sender as FrameworkElement)?.DataContext is not Draft d||d.Locked)return;try{if(store.Read().Tasks.Any(t=>t.StageId==d.Id))throw new ArgumentException("На этом этапе есть задачи. Сначала измените их статусы.");rows.Remove(d);}catch(Exception ex){ErrorLabel.Text=ex.Message;}}
 private void Save_Click(object sender,RoutedEventArgs e){try{store.ReplaceStages(rows.Select(d=>new TaskStage(d.Id,d.Name.Trim(),d.IsDone)).ToList());Saved=true;Close();}catch(Exception ex){ErrorLabel.Text=ex.Message;}}
 public sealed class Draft{public string Id{get;set;}="";public string Name{get;set;}="";public bool IsDone{get;set;}public bool Locked=>Id=="backlog";public bool Editable=>!Locked;}
}
