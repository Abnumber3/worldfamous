using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client.Extensibility;


// all this does is shorten the logic within the controller

namespace Infrastructure.Data
{
    public class ProductRepository : IProductRepository
    {
        private readonly StoreContext _context;
        public ProductRepository(StoreContext context)
        {
            _context = context;
        }

        //it includes the product type in the get products response call
        public async Task<IReadOnlyList<Product>> GetProductsAsync()
        {
            return await _context.Products
            .Include(p => p.ProductType)
            .ToListAsync();
        }


        // will return product by id and will include the product type in the response call
             public async Task<Product> GetProductsByIdAsync(int id)
        {
              return await _context.Products
              .Include(p => p.ProductType)
              .FirstOrDefaultAsync(p => p.Id == id);


        }


        // will return product types in response call
        public async Task<IReadOnlyList<ProductType>> GetProductTypesAsync()
        {
            return await _context.ProductTypes.ToListAsync();
        }
    }
}