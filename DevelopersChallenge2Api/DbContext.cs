using Microsoft.EntityFrameworkCore;
using System;

namespace DevelopersChallenge2Api {
  public class ApplicationDatabaseContext : DbContext {
    public DbSet<Models.Transaction> Transactions { get; set; }
    public ApplicationDatabaseContext(DbContextOptions<ApplicationDatabaseContext> options) : base(options) {}
  }
}