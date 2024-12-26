using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Core.Entities;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data
{
   public class StoreContextSeed
   {
    public static async Task SeedAsync(StoreContext context)
    {
        // standard practice that sql server will generate the id for us so I removed the id from the json file

        if(!context.Products.Any()){
            var productsData = File.ReadAllText("../Infrastructure/Data/SeedData/products.json");
            var products = JsonSerializer.Deserialize<List<Product>>(productsData);
            context.Products.AddRange(products);
        }
    

        if(!context.ProductTypes.Any()){
            var typesData = File.ReadAllText("../Infrastructure/Data/SeedData/types.json");
            var types = JsonSerializer.Deserialize<List<ProductType>>(typesData);
            
            context.ProductTypes.AddRange(types);
        }
        
        

        if(context.ChangeTracker.HasChanges()){
            await context.SaveChangesAsync();
        }
    }







   }
}
