using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Interfaces;
using Core.Entities;
using StackExchange.Redis;
using System.Text.Json;

namespace Infrastructure.Data
{
    public class BasketRepository : IBasketRepository
    {
        private readonly IDatabase _database;
        public BasketRepository(IConnectionMultiplexer redis)
        {
            // Initialize any required resources here, such as a database context
            _database = redis.GetDatabase();
        }
        public async Task<bool> DeleteBasketAsync(string basketId)
        {
           return await _database.KeyDeleteAsync(basketId);
            // Delete the basket with the specified ID from the Redis database
            // Return true if the deletion was successful, otherwise false
        }

        public async Task<CustomerBasket> GetBasketAsync(string basketId)
        {
            var data = await _database.StringGetAsync(basketId);
           
           return data.IsNullOrEmpty ? null : JsonSerializer.Deserialize<CustomerBasket>(data);

            // If the basket is not found, return null
            // return data.IsNullOrEmpty ? null : JsonSerializer.Deserialize<CustomerBasket>(data);
        }

        public async Task<CustomerBasket> UpdateBasketAsync(CustomerBasket basket)
        {
            var created = await _database.StringSetAsync(basket.Id, JsonSerializer.Serialize(basket), TimeSpan.FromDays(31));

           if (!created)
            {
                throw new Exception("Problem saving basket");
            }

            return await GetBasketAsync(basket.Id);
        }
    }
}