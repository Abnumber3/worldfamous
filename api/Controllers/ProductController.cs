using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Infrastructure.Data;
using Core.Entities;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly StoreContext _context;

        public ProductController(StoreContext context)
        {
            _context = context;
        }


        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetProducts()
        {
            var products = await _context.Products.ToListAsync();

            return Ok(products);
        }



         [HttpGet("{id}")]
        public async Task<ActionResult<Product>>GetProductsById([FromRoute] int id)
        {
          return await _context.Products.FindAsync(id);
        }
    }
}
