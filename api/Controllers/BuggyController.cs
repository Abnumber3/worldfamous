using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    public class BuggyController : BaseApiController
    {
        private readonly StoreContext _context;
        public BuggyController(StoreContext context)
        {
            _context = context;
        }




        [HttpGet("notfound")]
        public ActionResult GetNotFoundRequest()
        {
            var thing = _context.Products.Find(72);
            if(thing == null)
            {
                return NotFound(new api.Errors.ApiResponse(404));
            }
            return Ok();
        }


         [HttpGet("servererror")]
        public ActionResult GetSeverError()
        {
            var thing = _context.Products.Find(72);
            var thingToReturn = thing.ToString();

            return Ok();
        }


         [HttpGet("badrequest")]
        public ActionResult GetBadRequest()
        {
            return BadRequest(new api.Errors.ApiResponse(400));
        }
        

            [HttpGet("badrequest/{id}")]
        public ActionResult GetNotFoundRequest(int id)
        {
            return Ok();
        }



    }


}