namespace TaskCapture.Windows;
public sealed class TrayService:IDisposable {
 private readonly System.Windows.Forms.NotifyIcon icon;
 public TrayService(MainWindow window){var menu=new System.Windows.Forms.ContextMenuStrip();menu.Items.Add("Открыть TaskCapture",null,(_,_)=>window.Dispatcher.BeginInvoke(new Action(window.ShowFromTray)));menu.Items.Add("Выход",null,(_,_)=>window.Dispatcher.BeginInvoke(new Action(async()=>await window.ExitAsync())));System.Drawing.Icon image;try{image=System.Drawing.Icon.ExtractAssociatedIcon(Environment.ProcessPath!)??System.Drawing.SystemIcons.Application;}catch{image=System.Drawing.SystemIcons.Application;}icon=new(){Text="TaskCapture Glass",Icon=image,Visible=true,ContextMenuStrip=menu};icon.DoubleClick+=(_,_)=>window.Dispatcher.BeginInvoke(new Action(window.ShowFromTray));}
 public void Dispose(){icon.Visible=false;icon.ContextMenuStrip?.Dispose();icon.Dispose();}
}
