using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using DevelopersChallenge2Api.Models;

namespace DevelopersChallenge2Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionsController : ControllerBase
    {

        ApplicationDatabaseContext _applicationDatabase;

        public TransactionsController(ApplicationDatabaseContext context)
        {
            _applicationDatabase = context;
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<Transaction>), StatusCodes.Status200OK)]
        public ActionResult<IEnumerable<Transaction>> Get()
        {
            return Ok(new List<Transaction>(_applicationDatabase.Transactions.ToList()));
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(Transaction), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult Get(int id)
        {
            var transaction = _applicationDatabase.Transactions.Where(t => t.Id == id).SingleOrDefault();

            if (transaction == null) {
                return NotFound();
            }

            return Ok(transaction);
        }
    }
}
