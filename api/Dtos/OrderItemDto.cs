// using System;
// using System.Collections.Generic;
// using System.ComponentModel;
// using System.Linq;
// using System.Threading.Tasks;
// using Core.Entities.OrderAggregate;

// namespace api.Dtos
// {
//     public class OrderItemDto
//     {
//        public int ProductId { get; set; }

//        public int ProductName { get; set; }

//        public string PictureUrl { get; set; }

//        public decimal MyProperty { get; set; }

//        public int Quantity { get; set; }


//     }
// }


public class OrderItemDto
{
    public int ProductId { get; set; }
    public string ProductName { get; set; }   // ✅ string
    public string PictureUrl { get; set; }
    public decimal Price { get; set; }         // ✅ matches Angular
    public int Quantity { get; set; }
}
