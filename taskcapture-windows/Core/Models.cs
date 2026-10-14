namespace TaskCapture.Core;
public sealed record TaskStage(string Id, string Name, bool IsDone);
public sealed record TaskItem(string Id, string Title, string Description, string Source, string StageId, DateTimeOffset CreatedUtc, int ContentRevision=0, string Processing="pending", string Error="");
public sealed record TaskDocument(List<TaskStage> Stages, List<TaskItem> Tasks)
{
 public static List<TaskStage> DefaultStages()=>[new("backlog","Бэклог",false),new("in_progress","В работе",false),new("done","Выполнено",true)];
}
public sealed record NormalizedTask(string Title,string Description);
public sealed class StoreConflictException(string message):IOException(message);
