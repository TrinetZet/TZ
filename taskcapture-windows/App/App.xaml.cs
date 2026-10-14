using System.Windows;
namespace TaskCapture.Windows;
public partial class App:Application {
 private Mutex? instance;
 protected override void OnStartup(StartupEventArgs e){base.OnStartup(e);instance=new Mutex(true,"Local\\TaskCaptureGlassWindows",out bool created);if(!created){MessageBox.Show("TaskCapture уже работает. Откройте его через значок в трее.","TaskCapture");Shutdown();return;}try{var window=new MainWindow();MainWindow=window;window.Show();if(e.Args.Contains("--background")&&window.Store is not null)window.Hide();}catch(Exception ex){MessageBox.Show(ex.Message,"Не удалось запустить TaskCapture");Shutdown(1);}}
 protected override void OnExit(ExitEventArgs e){instance?.Dispose();base.OnExit(e);}
}
