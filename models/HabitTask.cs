namespace HabitsApp.Models
{
  public class HabitTask
  {
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    // Tillfällig användar-id tills login är klart
    public int UserId { get; set; } = 1;

    public ICollection<TaskLog>? TaskLog { get; set; }
  }
}
