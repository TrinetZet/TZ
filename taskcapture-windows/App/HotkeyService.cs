using System.Windows.Interop;
using TaskCapture.Core;
namespace TaskCapture.Windows;
public sealed class HotkeyService:IDisposable {
 private readonly HwndSource source;private int currentId;private Hotkey? current;
 public event Action? Pressed;
 public HotkeyService(IntPtr handle){source=HwndSource.FromHwnd(handle)??throw new ArgumentException("Нет окна для горячей клавиши.");source.AddHook(Hook);}
 public void Change(string combination){var key=Hotkey.Parse(combination);if(current?.Modifiers==key.Modifiers&&current.VirtualKey==key.VirtualKey)return;int next=currentId==0x5443?0x5444:0x5443;if(!NativeMethods.RegisterHotKey(source.Handle,next,key.Modifiers|0x4000,key.VirtualKey))throw new InvalidOperationException("Сочетание занято Windows или другим приложением. Выберите другое.");if(currentId!=0)NativeMethods.UnregisterHotKey(source.Handle,currentId);currentId=next;current=key;}
 private IntPtr Hook(IntPtr h,int message,IntPtr w,IntPtr l,ref bool handled){if(message==0x0312&&w.ToInt32()==currentId){handled=true;Pressed?.Invoke();}return IntPtr.Zero;}
 public void Dispose(){if(currentId!=0){NativeMethods.UnregisterHotKey(source.Handle,currentId);currentId=0;}source.RemoveHook(Hook);}
}
