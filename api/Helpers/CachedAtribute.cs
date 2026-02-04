using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;

namespace api.Helpers
{
    public class CachedAtribute : Attribute, IAsyncActionFilter
    {
        private readonly int _timeToLiveSeconds;

        public CachedAtribute(int timeToLiveSeconds)
        {
            _timeToLiveSeconds = timeToLiveSeconds;
        }
        public Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var chacheService = context.HttpContext.RequestServices.GetRequiredService<IResponseCacheService>();
            {
                var cacheKey = GenerateCacheKeyFromRequest(context.HttpContext.Request);)
            }
        }

        private string GenerateCacheKeyFromRequest(HttpRequest request)
        {
            throw new NotImplementedException();
        }
    }
}