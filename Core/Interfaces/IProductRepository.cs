using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;

namespace Core.Interfaces
{
    public interface IProductRepository

    //this is the interface for the product repository. It will have methods that will be implemented in the ProductRepository class
    {
        Task<IReadOnlyList<Product>> GetProductsAsync();
        
        Task<Product> GetProductsByIdAsync(int id);

        Task<IReadOnlyList<ProductType>> GetProductTypesAsync();
 
    }
}