namespace HabitsApp.Dtos;

public class HabitTaskCreateDto
{
  public string Title { get; set; } = null!;
  public string? Description { get; set; }
}

public class HabitTaskUpdateDto
{
  public string Title { get; set; } = null!;
  public string? Description { get; set; }
}

public class HabitTaskReadDto
{
  public int Id { get; set; }
  public string Title { get; set; } = null!;
  public string? Description { get; set; }
  public DateTime CreatedAt { get; set; }
}
