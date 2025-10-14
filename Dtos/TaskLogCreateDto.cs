public class TaskLogCreateDto
{
  public int TaskId { get; set; }
  public DateTime Date { get; set; }
  public bool IsCompleted { get; set; } = true; // default true
}