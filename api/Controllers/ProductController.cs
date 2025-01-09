using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Infrastructure.Data;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using api.Dtos;
using AutoMapper;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        // Injecting my repository(Services _repo) to clean up my api calls

        // the generic repository will have generic logic that can be used for all entities, whatever that is passed in the angle brackets will be the entity that it will be working with

        private readonly IGenericRepository<Product> _productsRepo;
        private readonly IGenericRepository<ProductType> _productTypeRepo;

        private readonly IMapper _mapper;

        public ProductController(IGenericRepository<Product> productsRepo,
        IGenericRepository<ProductType> productTypeRepo, IMapper mapper )
        {
            _productsRepo = productsRepo;
            _productTypeRepo = productTypeRepo;
            _mapper = mapper;
        }



    




        // Gets all products and returns them as a DTO (certain columns missing from the original entity). the purpose is to only let the user see what they need to see
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<ProductToReturnDto>>> GetProducts()
        {
            var spec = new ProductsWithTypesSpecification();
            var products = await _productsRepo.ListAsync(spec);
            return Ok(_mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductToReturnDto>>(products));
        }







        // Get all items by specific Id
        [ProducesResponseType(typeof(ProductToReturnDto), 200)]
        [ProducesResponseType(404)]
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductToReturnDto>> GetProductsById(int id)
        {
            var spec = new ProductsWithTypesSpecification(id);
            var product = await _productsRepo.GetEntityWithSpec(spec);


            if (product == null)
            {
                return NotFound(); // This returns a 404 response
            }
            
          return _mapper.Map<Product, ProductToReturnDto>(product);
        }

        





        // Get all product types
        [HttpGet("types")]
        public async Task<ActionResult<List<ProductType>>> GetProductTypes()
        {
            var productTypes = await _productTypeRepo.ListAllAsync();
            return Ok(productTypes);
        }
    }
}