using Microsoft.EntityFrameworkCore;
using HabitsApp.Models;

namespace HabitsApp.Data
{
  public class AppDbContext : DbContext
  {
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Tabeller
    public DbSet<User> Users { get; set; }
    public DbSet<HabitTask> Tasks { get; set; }
    public DbSet<TaskLog> TaskLogs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      base.OnModelCreating(modelBuilder);

      // Task -> TaskLogs (1:N)
      modelBuilder.Entity<TaskLog>()
          .HasOne(tl => tl.Task)
          .WithMany(t => t.TaskLog)
          .HasForeignKey(tl => tl.TaskId)
          .OnDelete(DeleteBehavior.Cascade);


    }
  }
}
