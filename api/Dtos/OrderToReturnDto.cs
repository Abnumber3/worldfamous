using System;
using System.Collections.Generic;

namespace api.Dtos
{
    public class OrderToReturnDto
    {
        public int Id { get; set; }

        public string BuyerEmail { get; set; }

        public DateTimeOffset OrderDate { get; set; }

        public AddressDto ShipToAddress { get; set; }   // ✅ DTO, not domain

        public decimal ShippingPrice { get; set; }

        public string DeliveryMethod { get; set; }

        public IReadOnlyList<OrderItemDto> OrderItems { get; set; } // ✅ DTO

        public decimal Subtotal { get; set; }

        public decimal Total { get; set; }

        public string Status { get; set; }
    }
}
