using System.Runtime.InteropServices;
using System.Windows;
namespace TaskCapture.Windows;
public static class SelectionCapture {
 public static async Task<string> CaptureAsync(){
  var foreground=NativeMethods.GetForegroundWindow();if(foreground==IntPtr.Zero)throw new InvalidOperationException("Нет активного окна.");
  int[] modifiers=[16,17,18,91,92];var until=DateTime.UtcNow.AddMilliseconds(1500);
  while(modifiers.Any(k=>(NativeMethods.GetAsyncKeyState(k)&0x8000)!=0)){if(DateTime.UtcNow>until)throw new InvalidOperationException("Отпустите клавиши и повторите сочетание.");await Task.Delay(20);}
  if(NativeMethods.GetForegroundWindow()!=foreground)throw new InvalidOperationException("Активное окно изменилось. Повторите захват.");
  uint sequence=NativeMethods.GetClipboardSequenceNumber();NativeMethods.CopyShortcut();until=DateTime.UtcNow.AddMilliseconds(1500);
  while(DateTime.UtcNow<until){
   if(NativeMethods.GetForegroundWindow()!=foreground)throw new InvalidOperationException("Активное окно изменилось. Повторите захват.");
   if(NativeMethods.GetClipboardSequenceNumber()!=sequence){try{if(!Clipboard.ContainsText(TextDataFormat.UnicodeText))throw new InvalidOperationException("Выделение не содержит текста.");string text=Clipboard.GetText(TextDataFormat.UnicodeText);if(string.IsNullOrWhiteSpace(text)||text.Length>65536||text.Contains('\0'))throw new InvalidOperationException("Выделите текст до65536 символов.");return text;}catch(COMException){}}
   await Task.Delay(25);
  }throw new InvalidOperationException("Не удалось скопировать выделение. Выделите текст в приложении, где работает Ctrl+C.");
 }
}
