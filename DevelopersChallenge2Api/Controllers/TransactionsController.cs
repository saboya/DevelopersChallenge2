namespace DevelopersChallenge2Api.Controllers
{
    using System.Collections.Generic;
    using System.Linq;
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
            applicationDatabase = context;
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<Transaction>), StatusCodes.Status200OK)]
        public ActionResult<IEnumerable<Transaction>> Get()
        {
            return Ok(new List<Transaction>(applicationDatabase.Transactions.ToList()));
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(Transaction), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult Get(int id)
        {
            var transaction = applicationDatabase.Transactions.Where(t => t.Id == id).SingleOrDefault();

            if (transaction == null)
            {
                return NotFound();
            }

            return Ok(transaction);
        }
    }
}
