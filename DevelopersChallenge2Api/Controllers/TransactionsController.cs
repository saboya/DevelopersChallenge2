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
            return this.Ok(new List<Transaction>(this.applicationDatabase.Transactions.ToList()));
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
            var filePath = Path.GetTempFileName();

            var transactions = files
                .Select(file => Util.OfxParser.ParseFile(new FileStream(filePath, FileMode.Create)))
                .Aggregate((acc, t) => acc.Concat(t))
                .OrderBy(t => t.Timestamp);

            using (var dbTransaction = this.applicationDatabase.Database.BeginTransaction())
            {
                try
                {
                    this.applicationDatabase.Transactions.AddRange(transactions);
                    applicationDatabase.SaveChanges();
                    dbTransaction.Commit();
                }
                catch
                {
                    dbTransaction.Rollback();
                }
            }

            return Ok(transactions);
        }
    }
}
