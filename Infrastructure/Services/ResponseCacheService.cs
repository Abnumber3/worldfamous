using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Interfaces;

namespace Infrastructure.Services
{
    public class ResponseCacheService : IResponseCacheService
    {
        public Task CacheResponseAsync(string cacheKey, object response, TimeSpan timeToLive)
        {
            throw new NotImplementedException();
        }

        public Task<string> GetChachedResponseAsync(string cacheKey)
        {
            throw new NotImplementedException();
        }
    }
}