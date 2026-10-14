using System.Text.Json;
using Microsoft.Win32;
namespace TaskCapture.Windows;
public sealed record AppSettings(string MarkdownPath,string Hotkey="Ctrl+Shift+T",bool StartOnLogin=false);
public static class SettingsStore {
 public static string Path=>System.IO.Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),"TaskCaptureGlass","settings.json");
 public static AppSettings? Load(){if(!File.Exists(Path))return null;try{return JsonSerializer.Deserialize<AppSettings>(File.ReadAllText(Path));}catch(JsonException){throw new IOException("Не удалось прочитать настройки. Файл настроек сохранён для восстановления.");}}
 public static void Save(AppSettings settings){TaskCapture.Core.Hotkey.Parse(settings.Hotkey);Directory.CreateDirectory(System.IO.Path.GetDirectoryName(Path)!);string temp=Path+".tmp";using(var file=new FileStream(temp,FileMode.Create,FileAccess.Write,FileShare.None)){JsonSerializer.Serialize(file,settings);file.Flush(true);}File.Move(temp,Path,true);}
 public static void SetAutostart(bool enabled){using var key=Registry.CurrentUser.CreateSubKey(@"Software\Microsoft\Windows\CurrentVersion\Run");if(enabled)key.SetValue("TaskCaptureGlass","\""+Environment.ProcessPath+"\" --background");else key.DeleteValue("TaskCaptureGlass",false);}
}
