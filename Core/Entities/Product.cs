using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class Product : BaseEntity
    {
          //this is the product entity. It will have the properties that will be used to create the product table in the database and each primative property is a column section in the table.
      
                public string Name { get; set; } = string.Empty;

                public string Description {get; set;} = string.Empty;

                public decimal Price {get; set;}

                public string PictureUrl { get; set; } = string.Empty;
                public int ProductTypeId { get; set; }
                public  ProductType? ProductType { get; set; }       
                
    }
}