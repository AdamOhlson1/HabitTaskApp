using HabitsApp.Data;
using HabitsApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HabitsApp.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  [Authorize]
  public class TaskLogController : ControllerBase
  {
    private readonly AppDbContext _context;

    public TaskLogController(AppDbContext context)
    {
      _context = context;
    }

    private int GetUserId()
    {
      var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "id");
      if (userIdClaim == null)
        throw new Exception("User ID saknas i token.");
      return int.Parse(userIdClaim.Value);
    }

    // GET: api/tasklog
    [HttpGet]
    public async Task<ActionResult<List<TaskLogDto>>> GetAll()
    {
      int userId = GetUserId();

      var logs = await _context.TaskLogs
          .Include(t => t.Task)
          .Where(t => t.Task.UserId == userId)
          .Select(t => new TaskLogDto
          {
            TaskId = t.TaskId,
            Date = t.Date,
            IsCompleted = t.IsCompleted
          })
          .ToListAsync();

      return Ok(logs);
    }

    // POST: api/tasklog
    [HttpPost]
    public async Task<ActionResult> LogTask(TaskLogDto dto)
    {
      int userId = GetUserId();

      // Konvertera till lokal tid och ta bara datumdelen
      var localDate = dto.Date.ToLocalTime().Date;

      // Kolla om loggen redan finns för denna task och datum
      var existing = await _context.TaskLogs
          .Include(t => t.Task)
          .FirstOrDefaultAsync(t => t.TaskId == dto.TaskId &&
                                    t.Date.Date == localDate &&
                                    t.Task.UserId == userId);

      if (existing != null)
      {
        // Uppdatera
        existing.IsCompleted = dto.IsCompleted;
      }
      else
      {
        // Skapa ny log
        var task = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == dto.TaskId && t.UserId == userId);
        if (task == null) return NotFound();

        var newLog = new TaskLog
        {
          TaskId = dto.TaskId,
          Date = localDate,
          IsCompleted = dto.IsCompleted
        };
        _context.TaskLogs.Add(newLog);
      }

      await _context.SaveChangesAsync();
      return Ok();
    }

    public class TaskLogDto
    {
      public int TaskId { get; set; }
      public DateTime Date { get; set; }
      public bool IsCompleted { get; set; }
    }
  }
}
