using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;

namespace Core.Specifications
{ public class ProductWithFiltersForCountSpecification : BaseSpecification<Product>
    {
        public ProductWithFiltersForCountSpecification(string? search, int? typeId)
            : base(x =>
                (string.IsNullOrEmpty(search) || x.Name.ToLower().Contains(search.ToLower())) &&
                (!typeId.HasValue || x.ProductTypeId == typeId)
            )
        {
            // No includes, sorting, or pagination needed, just counting filtered products
        }
    }
}