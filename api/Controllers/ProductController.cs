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
using api.Errors;
using api.Helpers;


namespace api.Controllers
{
    public class ProductController : BaseApiController
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
        // [HttpGet]
        // public async Task<ActionResult<IReadOnlyList<ProductToReturnDto>>> GetProducts(
        //     string sort, int? typeId)
        // {
        //     var spec = new ProductsWithTypesSpecification(sort, typeId);
        //     var products = await _productsRepo.ListAsync(spec);
        //     return Ok(_mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductToReturnDto>>(products));
        // }


//             [HttpGet]
// public async Task<ActionResult<IReadOnlyList<ProductToReturnDto>>> GetProducts(
//     string? sort = null, int? typeId = null)
// {
//     var spec = new ProductsWithTypesSpecification(sort, typeId, pageIndex, pageSize);
//     var products = await _productsRepo.ListAsync(spec);
    
//     return Ok(_mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductToReturnDto>>(products));
// }

[HttpGet]
public async Task<ActionResult<Pagination<ProductToReturnDto>>> GetProducts(
    string? sort = null, 
    int? typeId = null, 
    string? search = null,
    int pageIndex = 1, 
    int pageSize = 10)
{

     try
    {
        var spec = new ProductsWithTypesSpecification(sort, typeId, search, pageIndex, pageSize);
        var countSpec = new ProductWithFiltersForCountSpecification(search, typeId);
        
        var totalItems = await _productsRepo.CountAsync(countSpec);
        if (totalItems == 0) return NotFound(new ApiResponse(404, "No products found matching your search criteria."));
        
        var products = await _productsRepo.ListAsync(spec);

        var data = _mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductToReturnDto>>(products);

        return Ok(new Pagination<ProductToReturnDto>(pageIndex, pageSize, totalItems, data));
    }
    catch 
    {
        return StatusCode(500, new ApiResponse(500, "An error occurred while processing your request."));
    }
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
                return NotFound(new ApiResponse(404)); // This returns a 404 response
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