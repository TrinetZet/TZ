using System.Windows;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Interop;
namespace TaskCapture.Windows;
public static class Motion {
 public static void Appear(FrameworkElement element){if(!SystemParameters.ClientAreaAnimation)return;element.Opacity=0;element.RenderTransform=new TranslateTransform(0,12);element.BeginAnimation(UIElement.OpacityProperty,new DoubleAnimation(1,TimeSpan.FromMilliseconds(320)));((TranslateTransform)element.RenderTransform).BeginAnimation(TranslateTransform.YProperty,new DoubleAnimation(0,TimeSpan.FromMilliseconds(400)){EasingFunction=new CubicEase{EasingMode=EasingMode.EaseOut}});}
 public static void Backdrop(Window window){try{var handle=new WindowInteropHelper(window).Handle;int dark=1;NativeMethods.DwmSetWindowAttribute(handle,20,ref dark,4);int mica=2;NativeMethods.DwmSetWindowAttribute(handle,38,ref mica,4);}catch(DllNotFoundException){}catch(EntryPointNotFoundException){}}
}
