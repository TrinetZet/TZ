using System.Text.Json;
namespace TaskCapture.Core;
public static class OutputValidator {
 public static NormalizedTask Parse(string json){try{if(json.Length>16384)throw new FormatException("Слишком большой ответ модели.");using var doc=JsonDocument.Parse(json);var root=doc.RootElement;if(root.ValueKind!=JsonValueKind.Object||root.EnumerateObject().Count()!=2||!root.TryGetProperty("title",out var title)||!root.TryGetProperty("description",out var description)||title.ValueKind!=JsonValueKind.String||description.ValueKind!=JsonValueKind.String)throw new FormatException("Некорректный ответ модели.");string t=title.GetString()!.Trim(),d=description.GetString()!.Trim();if(t.Length is 0 or >100||d.Length is 0 or >300||t.Contains('\0')||d.Contains('\0'))throw new FormatException("Некорректная длина ответа модели.");return new(t,d);}catch(JsonException e){throw new FormatException("Модель вернула некорректный JSON.",e);}}
}
