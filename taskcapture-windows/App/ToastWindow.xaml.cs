using System.Windows;
using System.Windows.Threading;
namespace TaskCapture.Windows;
public partial class ToastWindow:Window {
 public ToastWindow(string title,string subtitle,bool error){InitializeComponent();TitleLabel.Text=title;SubtitleLabel.Text=subtitle;IconLabel.Text=error?"!":"✓";Rect area=SystemParameters.WorkArea;Left=area.Right-Width-18;Top=area.Bottom-Height-18;Loaded+=(_,_)=>Motion.Appear((FrameworkElement)Content);}
 public void ShowTimed(){Show();var timer=new DispatcherTimer{Interval=TimeSpan.FromMilliseconds(2600)};timer.Tick+=(_,_)=>{timer.Stop();Close();};timer.Start();}
}
