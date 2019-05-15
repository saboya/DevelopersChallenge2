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
    public class BalanceController : ControllerBase
    {
        private readonly ApplicationDatabaseContext applicationDatabase;

        public BalanceController(ApplicationDatabaseContext context)
        {
            this.applicationDatabase = context;
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<Balance>), StatusCodes.Status200OK)]
        public ActionResult<IEnumerable<Balance>> Get()
        {
            return this.Ok(new List<Balance>(this.applicationDatabase.Balances.OrderBy(t => t.Timestamp).ToList()));
        }
    }
}
