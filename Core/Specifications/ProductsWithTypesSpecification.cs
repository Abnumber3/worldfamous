using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Core.Entities;

namespace Core.Specifications
{
    // public class ProductsWithTypesSpecification : BaseSpecification<Product>
    // {
    //     public ProductsWithTypesSpecification(string sort, int? typeId)
    //     : base(x => !typeId.HasValue || x.ProductTypeId == typeId)
    //     {
    //         AddInclude(x => x.ProductType);
    //         AddOrderBy(x => x.Name);

    //         if (!string.IsNullOrEmpty(sort))
    //         {
    //             switch (sort)
    //             {
    //                 case "priceAsc":
    //                     AddOrderBy(p => p.Price);
    //                     break;
    //                 case "priceDesc":
    //                     AddOrderByDescending(p => p.Price);
    //                     break;
    //                 default:
    //                     AddOrderBy(n => n.Name);
    //                     break;
    //             }
    //         }
    //     }

    //     public ProductsWithTypesSpecification(int id): base(x => x.Id == id)
    //     {
    //         AddInclude(x => x.ProductType);
    //     }
        
        
    // }




    public class ProductsWithTypesSpecification : BaseSpecification<Product>
    {
        public ProductsWithTypesSpecification(string? sort, int? typeId, string? search, int pageIndex, int pageSize)
            : base(x => 
                (string.IsNullOrEmpty(search) || x.Name.ToLower().Contains(search.ToLower())) && 
                (!typeId.HasValue || x.ProductTypeId == typeId))
        {
            AddInclude(x => x.ProductType);
            
            if (!string.IsNullOrEmpty(sort))
            {
                switch (sort.ToLower())
                {
                    case "priceasc":
                        AddOrderBy(p => p.Price);
                        break;
                    case "pricedesc":
                        AddOrderByDescending(p => p.Price);
                        break;
                    default:
                        AddOrderBy(n => n.Name);
                        break;
                }
            }

            ApplyPaging((pageIndex - 1) * pageSize, pageSize);
        }

        public ProductsWithTypesSpecification(int id)
            : base(x => x.Id == id)
        {
            AddInclude(x => x.ProductType);
        }
    }
}