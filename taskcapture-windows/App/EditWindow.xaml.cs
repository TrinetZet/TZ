using System.Windows;
using System.Windows.Input;
using TaskCapture.Core;
namespace TaskCapture.Windows;
public partial class EditWindow:Window {
 private readonly TaskItem original;private readonly MarkdownStore store;public bool Saved{get;private set;}
 public EditWindow(TaskItem task,List<TaskStage> stages,MarkdownStore store){InitializeComponent();original=task;this.store=store;TitleBox.Text=task.Title;DescriptionBox.Text=task.Description;SourceBox.Text=task.Source;StageLabel.Text=stages.Single(s=>s.Id==task.StageId).Name+" · "+task.CreatedUtc.ToLocalTime().ToString("dd.MM.yyyy HH:mm");SourceInitialized+=(_,_)=>Motion.Backdrop(this);Loaded+=(_,_)=>Motion.Appear((FrameworkElement)Content);}
 private void Save_Click(object sender,RoutedEventArgs e){try{store.Edit(original.Id,MarkdownStore.Fingerprint(original),TitleBox.Text,DescriptionBox.Text,SourceBox.Text);Saved=true;new ToastWindow("Задача обновлена","Изменения сохранены в MD",false).ShowTimed();Close();}catch(Exception ex){ErrorLabel.Text=ex.Message;}}
 private void Window_KeyDown(object sender,KeyEventArgs e){if(e.Key==Key.Enter&&Keyboard.Modifiers.HasFlag(ModifierKeys.Control)){e.Handled=true;Save_Click(sender,e);}}
}
