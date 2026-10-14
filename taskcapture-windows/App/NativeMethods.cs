using System.Runtime.InteropServices;
namespace TaskCapture.Windows;
public static class NativeMethods {
 [DllImport("user32.dll",SetLastError=true)]public static extern bool RegisterHotKey(IntPtr window,int id,uint modifiers,uint key);
 [DllImport("user32.dll",SetLastError=true)]public static extern bool UnregisterHotKey(IntPtr window,int id);
 [DllImport("user32.dll")]public static extern IntPtr GetForegroundWindow();
 [DllImport("user32.dll")]public static extern bool SetForegroundWindow(IntPtr window);
 [DllImport("user32.dll")]public static extern uint GetClipboardSequenceNumber();
 [DllImport("user32.dll")]public static extern short GetAsyncKeyState(int key);
 [DllImport("user32.dll",SetLastError=true)]public static extern uint SendInput(uint count,Input[] inputs,int size);
 [DllImport("dwmapi.dll")]public static extern int DwmSetWindowAttribute(IntPtr window,int attribute,ref int value,int size);
 [StructLayout(LayoutKind.Sequential)]public struct Input{public uint Type;public InputUnion Union;}
 [StructLayout(LayoutKind.Explicit)]public struct InputUnion{[FieldOffset(0)]public KeyboardInput Keyboard;[FieldOffset(0)]public MouseInput Mouse;}
 [StructLayout(LayoutKind.Sequential)]public struct KeyboardInput{public ushort Key,Scan;public uint Flags,Time;public UIntPtr Extra;}
 [StructLayout(LayoutKind.Sequential)]public struct MouseInput{public int X,Y;public uint Data,Flags,Time;public UIntPtr Extra;}
 public static Input Key(ushort key,bool up=false)=>new(){Type=1,Union=new(){Keyboard=new(){Key=key,Flags=up?2u:0}}};
 public static void CopyShortcut(){Input[] inputs=[Key(17),Key(67),Key(67,true),Key(17,true)];if(SendInput((uint)inputs.Length,inputs,Marshal.SizeOf<Input>())!=inputs.Length)throw new InvalidOperationException("Это приложение блокирует копирование. Попробуйте обычное Ctrl+C или окно без прав администратора.");}
}
