using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Core.Entities;

namespace Core.Specifications
{
    public class ProductsWithTypesSpecification : BaseSpecification<Product>
    {
        public ProductsWithTypesSpecification()
        {
            AddInclude(x => x.ProductType);
        }

        public ProductsWithTypesSpecification(int id): base(x => x.Id == id)
        {
            AddInclude(x => x.ProductType);
        }
        
        
    }
}