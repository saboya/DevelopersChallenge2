namespace DevelopersChallenge2Api {
  using DevelopersChallenge2Api.Models;
  using Microsoft.EntityFrameworkCore;

  public class ApplicationDatabaseContext : DbContext
  {
    public ApplicationDatabaseContext(DbContextOptions<ApplicationDatabaseContext> options)
      : base(options) { }

    public DbSet<Transaction> Transactions { get; set; }
  }
}