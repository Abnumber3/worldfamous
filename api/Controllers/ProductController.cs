using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Infrastructure.Data;
using Core.Entities;
using Core.Interfaces;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        // Injecting my repository(Services _repo) to clean up my api calls
        private readonly IProductRepository _repo;

        public ProductController(IProductRepository repo)
        {
            _repo = repo;
        }

        // Get all products
        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetProducts()
        {
            var products = await _repo.GetProductsAsync();
            return Ok(products);
        }

        // Get all items by specific Id
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProductsById(int id)
        {
            var product = await _repo.GetProductsByIdAsync(id);
            if (product == null) return NotFound();
            return Ok(product);
        }

        

        // Get all product types
        [HttpGet("types")]
        public async Task<ActionResult<List<ProductType>>> GetProductTypes()
        {
            var productTypes = await _repo.GetProductTypesAsync();
            return Ok(productTypes);
        }
    }
}