using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
namespace TaskCapture.Core;
public static class MarkdownCodec
{
 private sealed record Meta(string Id,string StageId,DateTimeOffset CreatedUtc,int ContentRevision,string Processing,string Error);
 public static void Validate(TaskDocument d){
  if(d.Stages.Count is <1 or >20 || d.Stages.Select(s=>s.Id).Distinct().Count()!=d.Stages.Count || d.Stages.Select(s=>s.Name.Trim()).Distinct(StringComparer.OrdinalIgnoreCase).Count()!=d.Stages.Count)throw new ArgumentException("Этапы должны иметь уникальные названия.");
  if(!d.Stages.Any(s=>s.Id=="backlog"&&s.Name=="Бэклог"&&!s.IsDone))throw new ArgumentException("Этап Бэклог обязателен.");
  foreach(var s in d.Stages)if(!Regex.IsMatch(s.Id,"^[a-zA-Z0-9_-]{1,64}$")||string.IsNullOrWhiteSpace(s.Name)||s.Name.Length>40||s.Name.Contains('\n')||s.Name.Contains('\r'))throw new ArgumentException("Некорректный этап.");
  if(d.Tasks.Select(t=>t.Id).Distinct().Count()!=d.Tasks.Count)throw new ArgumentException("Повторяющийся ID задачи.");
  foreach(var t in d.Tasks){if(!Regex.IsMatch(t.Id,"^[a-zA-Z0-9_-]{1,64}$")||!d.Stages.Any(s=>s.Id==t.StageId)||t.ContentRevision<0||t.Processing is not ("pending" or "ready" or "error"))throw new ArgumentException("Некорректные метаданные задачи.");ValidateTexts(t.Title,t.Description,t.Source);}
 }
 public static void ValidateTexts(string title,string description,string source){if(string.IsNullOrWhiteSpace(title)||title.Length>200||description.Length>4096||string.IsNullOrWhiteSpace(source)||source.Length>65536||title.Contains('\0')||description.Contains('\0')||source.Contains('\0'))throw new ArgumentException("Укажите заголовок и исходник. Максимум: заголовок200, описание4096, исходник65536 символов.");}
 public static string Encode(TaskDocument document){
  Validate(document);var b=new StringBuilder("# TaskCapture\n\n");b.Append("<!-- taskcapture-document:").Append(Pack(document.Stages)).Append(" -->\n\n");
  foreach(var t in document.Tasks){var stage=document.Stages.Single(s=>s.Id==t.StageId);b.Append("<!-- taskcapture-task:").Append(Pack(new Meta(t.Id,t.StageId,t.CreatedUtc,t.ContentRevision,t.Processing,t.Error))).Append(" -->\n");
   b.Append("## ").Append(Escape(t.Title)).Append("\n\n- Статус: ").Append(Escape(stage.Name)).Append("\n- Создано: ").Append(t.CreatedUtc.ToString("O")).Append("\n- Обработка: ").Append(t.Processing).Append("\n\n");
   Field(b,"Заголовок",t.Title);Field(b,"Описание",t.Description);Field(b,"Исходный текст",t.Source);b.Append("\n");
  }return b.ToString();
 }
 private static string Escape(string s)=>Regex.Replace(s.Replace('\r',' ').Replace('\n',' '),@"([\\`*_{}\[\]<>#!|])",@"\$1");
 private static void Field(StringBuilder b,string label,string value){int longest=0,current=0;foreach(char c in value){current=c=='~'?current+1:0;longest=Math.Max(longest,current);}string fence=new('~',Math.Max(3,longest+1));b.Append("### ").Append(label).Append('\n').Append(fence).Append('\n').Append(value).Append('\n').Append(fence).Append('\n');}
 private static string Pack<T>(T value)=>Convert.ToBase64String(Encoding.UTF8.GetBytes(JsonSerializer.Serialize(value)));
 private static T Unpack<T>(string line,string prefix){if(!line.StartsWith(prefix,StringComparison.Ordinal)||!line.EndsWith(" -->",StringComparison.Ordinal))throw new FormatException("Некорректный служебный блок MD.");return JsonSerializer.Deserialize<T>(Convert.FromBase64String(line[prefix.Length..^4]))??throw new FormatException("Пустой служебный блок.");}
 public static TaskDocument Decode(string markdown){
  try{
   int at=0;string Line(){int end=markdown.IndexOf('\n',at);if(end<0)throw new FormatException("Неполный MD-файл.");string line=markdown[at..end].TrimEnd('\r');at=end+1;return line;}
   void Expect(string wanted){if(Line()!=wanted)throw new FormatException("Нарушена структура MD. Не перезаписываем файл.");}
   string FieldValue(string label){Expect("### "+label);string fence=Line();if(fence.Length<3||fence.Any(c=>c!='~'))throw new FormatException("Некорректный текстовый блок.");int end=markdown.IndexOf("\n"+fence+"\n",at,StringComparison.Ordinal);int width=1+fence.Length+1;if(end<0){end=markdown.IndexOf("\r\n"+fence+"\r\n",at,StringComparison.Ordinal);width=2+fence.Length+2;}if(end<0)throw new FormatException("Незакрытый текстовый блок.");string value=markdown[at..end];at=end+width;return value;}
   Expect("# TaskCapture");Expect("");var stages=Unpack<List<TaskStage>>(Line(),"<!-- taskcapture-document:");Expect("");List<TaskItem> tasks=[];
   while(at<markdown.Length){if(markdown[at]=='\n'||markdown[at]=='\r'){if(Line()!="")throw new FormatException("Неизвестная строка.");continue;}
    var meta=Unpack<Meta>(Line(),"<!-- taskcapture-task:");if(!Line().StartsWith("## ",StringComparison.Ordinal))throw new FormatException("Нет заголовка задачи.");Expect("");
    if(!Line().StartsWith("- Статус: ",StringComparison.Ordinal)||!Line().StartsWith("- Создано: ",StringComparison.Ordinal)||!Line().StartsWith("- Обработка: ",StringComparison.Ordinal))throw new FormatException("Нарушена сводка задачи.");Expect("");
    string title=FieldValue("Заголовок"),description=FieldValue("Описание"),source=FieldValue("Исходный текст");tasks.Add(new(meta.Id,title,description,source,meta.StageId,meta.CreatedUtc,meta.ContentRevision,meta.Processing,meta.Error));
   }var result=new TaskDocument(stages,tasks);Validate(result);return result;
  }catch(Exception e)when(e is ArgumentException or JsonException or InvalidOperationException){throw new FormatException("Не удалось прочитать формат TaskCapture MD. Файл сохранён без изменений.",e);}
 }
}
