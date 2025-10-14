using HabitsApp.Data;
using HabitsApp.Dtos;
using HabitsApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace HabitsApp.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  [Authorize] // kräver JWT-token
  public class HabitsController : ControllerBase
  {
    private readonly AppDbContext _context;

    public HabitsController(AppDbContext context)
    {
      _context = context;
    }

    // 🔹 Hjälpmetod för att hämta UserId från token
    private int GetUserId()
    {
      var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "id");
      if (userIdClaim == null)
        throw new Exception("User ID saknas i token.");
      return int.Parse(userIdClaim.Value);
    }

    // === GET: api/habits ===
    [HttpGet]
    public async Task<ActionResult<List<HabitTaskReadDto>>> GetAll()
    {
      int userId = GetUserId();

      var habits = await _context.Tasks
          .Where(h => h.UserId == userId)
          .Select(h => new HabitTaskReadDto
          {
            Id = h.Id,
            Title = h.Title,
            Description = h.Description,
            CreatedAt = h.CreatedAt
          })
          .ToListAsync();

      return Ok(habits);
    }

    // === GET: api/habits/5 ===
    [HttpGet("{id}")]
    public async Task<ActionResult<HabitTaskReadDto>> GetById(int id)
    {
      int userId = GetUserId();

      var habit = await _context.Tasks
          .Where(h => h.UserId == userId && h.Id == id)
          .Select(h => new HabitTaskReadDto
          {
            Id = h.Id,
            Title = h.Title,
            Description = h.Description,
            CreatedAt = h.CreatedAt
          })
          .FirstOrDefaultAsync();

      if (habit == null)
        return NotFound();

      return Ok(habit);
    }

    // === POST: api/habits ===
    [HttpPost]
    public async Task<ActionResult> Create(HabitTaskCreateDto dto)
    {
      int userId = GetUserId();

      var habit = new HabitTask
      {
        Title = dto.Title,
        Description = dto.Description,
        CreatedAt = DateTime.Now,
        UserId = userId
      };

      _context.Tasks.Add(habit);
      await _context.SaveChangesAsync();

      return CreatedAtAction(nameof(GetById), new { id = habit.Id }, habit.Id);
    }

    // === PUT: api/habits/5 ===
    [HttpPut("{id}")]
    public async Task<ActionResult> Update(int id, HabitTaskUpdateDto dto)
    {
      int userId = GetUserId();

      var habit = await _context.Tasks.FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId);
      if (habit == null)
        return NotFound();

      habit.Title = dto.Title;
      habit.Description = dto.Description;

      await _context.SaveChangesAsync();
      return NoContent();
    }

    // === DELETE: api/habits/5 ===
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
      int userId = GetUserId();

      var habit = await _context.Tasks.FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId);
      if (habit == null)
        return NotFound();

      _context.Tasks.Remove(habit);
      await _context.SaveChangesAsync();

      return NoContent();
    }
  }
}
