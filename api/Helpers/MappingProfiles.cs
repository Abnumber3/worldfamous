using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Entities.Identity;
using Core.Entities.OrderAggregate;

namespace api.Helpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {

            // this is where we map our entities to our DTOs the product type is an object so the second line of code ensures that we only extrapolate the name of the product type
            CreateMap<Product, ProductToReturnDto>()
            .ForMember(dest => dest.ProductType, opt => opt.MapFrom(src => src.ProductType.Name)) // Mapping ProductType.Name

            .ForMember(dest => dest.PictureUrl, opt => opt.MapFrom<ProductUrlResolver>()); // Mapping PictureUrl

            CreateMap<Core.Entities.Identity.Address, AddressDto>().ReverseMap(); // ReverseMap allows us to map in both directions

            CreateMap<CustomerBasket, CustomerBasketDto>().ReverseMap();
            CreateMap<BasketItem, BasketItemDto>().ReverseMap();
            CreateMap<AddressDto, Core.Entities.OrderAggregate.Address>().ReverseMap();
            
            CreateMap<Order, OrderToReturnDto>()
            .ForMember(d => d.DeliveryMethod, o => o.MapFrom(s => s.DeliveryMethod.ShortName))
            .ForMember(d => d.ShipppingPrice, o => o.MapFrom(s => s.DeliveryMethod.ShortName));

            CreateMap<OrderItem, OrderItemDto>()
            .ForMember(d => d.ProductId, o => o.MapFrom(s => s.ItemOrdered.ProductItemId))
            .ForMember(d => d.ProductName, o => o.MapFrom(s => s.ItemOrdered.ProductName))
            .ForMember(d => d.PictureUrl, o => o.MapFrom(s => s.ItemOrdered.PictureUrl))
            .ForMember(d => d.PictureUrl, o => o.MapFrom<OrderItemUrlResolver>());

          
        }
    }
}