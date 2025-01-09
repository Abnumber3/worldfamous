using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos;
using AutoMapper;
using Core.Entities;

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
        }
    }
}