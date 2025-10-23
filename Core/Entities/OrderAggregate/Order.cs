using System;
using System.Collections.Generic;

namespace Core.Entities.OrderAggregate
{
    public class Order : BaseEntity
    {
        private List<OrderItem> items;
        private Address shippingAddress;
        private DeliveryMethod deliveryMethod;

        public Order()
        {
        }

        public Order(List<OrderItem> items, string buyerEmail, Address shippingAddress, DeliveryMethod deliveryMethod, decimal subtotal)
        {
            this.items = items;
            BuyerEmail = buyerEmail;
            this.shippingAddress = shippingAddress;
            this.deliveryMethod = deliveryMethod;
            Subtotal = subtotal;
        }

        public Order(IReadOnlyList<OrderItem> orderItems, string buyerEmail, DateTimeOffset orderDate,
            Address shipToAddress, DeliveryMethod deliveryMethod, decimal subtotal)
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

        public string PaymentIntentId { get; set; }

        public decimal GetTotal()
        {
            return Subtotal + DeliveryMethod.Price;
        }
    }
}
