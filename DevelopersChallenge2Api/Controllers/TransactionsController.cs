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
    public class TransactionsController : ControllerBase
    {
        private readonly ApplicationDatabaseContext applicationDatabase;

        public TransactionsController(ApplicationDatabaseContext context)
        {
            this.applicationDatabase = context;
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<Transaction>), StatusCodes.Status200OK)]
        public ActionResult<IEnumerable<Transaction>> Get()
        {
            return this.Ok(new List<Transaction>(this.applicationDatabase.Transactions.OrderBy(t => t.Timestamp).ToList()));
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(Transaction), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult Get(int id)
        {
            var transaction = this.applicationDatabase.Transactions.Where(t => t.Id == id).SingleOrDefault();

            if (transaction == null)
            {
                return NotFound();
            }

            return this.Ok(transaction);
        }

        [HttpPost("upload_ofx_files")]
        public async Task<IActionResult> Post(List<IFormFile> files)
        {
            var transactions = files
                .Select(file => Util.OfxParser.ParseFile(file.OpenReadStream()))
                .Aggregate((acc, t) => acc.Concat(t))
                .Distinct(new Util.TransactionComparer())
                .OrderBy(t => t.Timestamp);

            using (var dbTransaction = this.applicationDatabase.Database.BeginTransaction())
            {
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

                return Ok(transactions);
            }
        }
    }
}
