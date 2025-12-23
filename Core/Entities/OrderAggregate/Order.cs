using System;
using System.Collections.Generic;

namespace Core.Entities.OrderAggregate
{
    public class Order : BaseEntity
    {
        // Parameterless constructor required by EF
        public Order()
        {
        }

        // Constructor used when creating a new order
        public Order(
            List<OrderItem> items,
            string buyerEmail,
            Address shippingAddress,
            DeliveryMethod deliveryMethod,
            decimal subtotal)
        {
            OrderItems = items;
            BuyerEmail = buyerEmail;
            ShipToAddress = shippingAddress;
            DeliveryMethod = deliveryMethod;
            Subtotal = subtotal;
        }

        // Alternative constructor (used by specs / projections)
        public Order(
            IReadOnlyList<OrderItem> orderItems,
            string buyerEmail,
            DateTimeOffset orderDate,
            Address shipToAddress,
            DeliveryMethod deliveryMethod,
            decimal subtotal)
        {
            BuyerEmail = buyerEmail;
            OrderDate = orderDate;
            ShipToAddress = shipToAddress;
            DeliveryMethod = deliveryMethod;
            OrderItems = orderItems;
            Subtotal = subtotal;
        }

        public string BuyerEmail { get; set; }

        public DateTimeOffset OrderDate { get; set; } = DateTimeOffset.Now;

        public Address ShipToAddress { get; set; }

        public DeliveryMethod DeliveryMethod { get; set; }

        public IReadOnlyList<OrderItem> OrderItems { get; set; }

        public decimal Subtotal { get; set; }

        public OrderStatus Status { get; set; } = OrderStatus.Pending;

        // Stripe will populate this later — nullable is correct
        public string? PaymentIntentId { get; set; }

        public decimal GetTotal()
        {
            return Subtotal + DeliveryMethod.Price;
        }
    }
}
