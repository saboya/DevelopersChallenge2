namespace DevelopersChallenge2Api.Controllers
{
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Threading.Tasks;
    using DevelopersChallenge2Api.Models;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;

    [Route("api/[controller]")]
    [ApiController]
    public class OfxController : ControllerBase
    {
        private readonly ApplicationDatabaseContext applicationDatabase;

        public OfxController(ApplicationDatabaseContext context)
        {
            this.applicationDatabase = context;
        }

        [HttpPost("uploadFiles")]
        public async Task<IActionResult> Post(List<IFormFile> files)
        {
            var bankSections = files
                .Select(file => Util.OfxParser.ParseFile(file.OpenReadStream()))
                .Aggregate((acc, t) => acc.Concat(t));

            var transactions = bankSections.Select(b => b.Transactions)
                .Aggregate((acc, t) => acc.Concat(t))
                .Distinct(new Util.TransactionComparer())
                .OrderBy(t => t.Timestamp);

            using (var dbTransaction = this.applicationDatabase.Database.BeginTransaction())
            {
                foreach (var balance in bankSections.Select(b => b.Balance))
                {
                    try
                    {
                        this.applicationDatabase.Balances.Add(balance);
                        applicationDatabase.SaveChanges();
                    }
                    catch (System.Exception e)
                    {
                        if (e.InnerException.GetType() == typeof(Microsoft.Data.Sqlite.SqliteException))
                        {
                            if (!e.InnerException.Message.StartsWith("SQLite Error 19: 'UNIQUE constraint failed"))
                            {
                                throw e;
                            }
                        }
                    }
                }

                foreach (var transaction in transactions)
                {
                    try
                    {
                        this.applicationDatabase.Transactions.Add(transaction);
                        applicationDatabase.SaveChanges();
                    }
                    catch (System.Exception e)
                    {
                        if (e.InnerException.GetType() == typeof(Microsoft.Data.Sqlite.SqliteException))
                        {
                            if (!e.InnerException.Message.StartsWith("SQLite Error 19: 'UNIQUE constraint failed"))
                            {
                                throw e;
                            }
                        }
                    }
                }

                dbTransaction.Commit();

                return Ok(bankSections.Select(b => b.Balance));
            }
        }
    }
}
