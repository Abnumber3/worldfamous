using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface IBasketRepository1
    {
        Task<CustomerBasket> GetBasketAsync(string basketId);
    }

    public interface IBasketRepository
    {
        Task<CustomerBasket> GetBasketAsync(string basketId);
    }
}