namespace HabitsApp.Models;

public class TaskLog
{
  public int Id { get; set; }
  public int TaskId { get; set; }
  public HabitTask Task { get; set; }

  public DateTime Date { get; set; } = DateTime.Now;
  public bool IsCompleted { get; set; }
}