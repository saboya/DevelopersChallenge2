namespace DevelopersChallenge2Api
{
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;

    public static class Program
    {
        public static IWebHost Seed(this IWebHost webhost)
        {
            using (var scope = webhost.Services.GetService<IServiceScopeFactory>().CreateScope())
            {
                using (var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDatabaseContext>())
                {
                    dbContext.Database.EnsureCreated();
                    dbContext.Transactions.Add(new Models.Transaction());
                    dbContext.SaveChanges();
                }
            }

            return webhost;
        }

        public static IWebHost Migrate(this IWebHost webhost)
        {
            using (var scope = webhost.Services.GetService<IServiceScopeFactory>().CreateScope())
            {
                using (var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDatabaseContext>())
                {
                    dbContext.Database.Migrate();
                }
            }

            return webhost;
        }

        public static void Main(string[] args)
        {
            CreateWebHostBuilder(args).Build().Migrate().Seed().Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .ConfigureAppConfiguration((hostingContext, config) =>
                {
                    config.AddEnvironmentVariables(prefix: "DEVELOPERCHALLENGEAPI_");
                })
                .UseStartup<Startup>();
    }
}
