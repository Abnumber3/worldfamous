using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using api.Errors;
using Microsoft.AspNetCore.Authorization; // Ensure the namespace for error handling is included

namespace api.Controllers
{
    public class BuggyController : BaseApiController
    {
        private readonly StoreContext _context;

        public BuggyController(StoreContext context)
        {
            _context = context;
        }

        [HttpGet("testauth")]
        // [Authorize]
        public ActionResult<string> GetSecretText()
        {
            return "secret stuff";
        }

        // Example for Not Found Request
        [HttpGet("notfound")]
        public ActionResult GetNotFoundRequest()
        {
            var thing = _context.Products.Find(72);
            if (thing == null)
            {
                return NotFound(new ApiResponse(404, "Product with ID 72 not found"));
            }
            return Ok();
        }

        // Example for Server Error
        [HttpGet("servererror")]
        public ActionResult GetServerError()
        {
            try
            {
                var thing = _context.Products.Find(72);
                var thingToReturn = thing.ToString();
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiException(500, "A server error occurred while processing your request", ex.Message));
            }
        }

        // Example for Bad Request with general error
        [HttpGet("badrequest")]
        public ActionResult GetBadRequest()
        {
            return BadRequest(new ApiResponse(400, "Bad request, please check your parameters"));
        }

        // Example for Bad Request with dynamic error based on id
        [HttpGet("badrequest/{id}")]
        public ActionResult GetBadRequestWithId(int id)
        {
            if (id <= 0)
            {
                return BadRequest(new ApiResponse(400, "Invalid ID provided"));
            }

            // Simulating a search or some operation with the ID
            var thing = _context.Products.Find(id);
            if (thing == null)
            {
                return NotFound(new ApiResponse(404, $"Product with ID {id} not found"));
            }

            return Ok(thing);
        }

        // Example for handling search queries
        [HttpGet("search/{query}")]
        public ActionResult SearchProducts(string query)
        {
            if (string.IsNullOrEmpty(query))
            {
                return BadRequest(new ApiValidationErrorResponse { Errors = new[] { "Search query cannot be empty" } });
            }

            try
            {
                var results = _context.Products.Where(p => p.Name.Contains(query)).ToList();

                if (results.Count == 0)
                {
                    return NotFound(new ApiResponse(404, "No products found matching your search criteria"));
                }

                return Ok(results);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiException(500, "An error occurred while processing your search query", ex.Message));
            }
        }
    }
}
