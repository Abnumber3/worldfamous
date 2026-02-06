using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
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
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var cacheService = context.HttpContext.RequestServices.GetRequiredService<IResponseCacheService>();
            {
                var cacheKey = GenerateCacheKeyFromRequest(context.HttpContext.Request);
                var cachedResponse = await cacheService.GetChachedResponseAsync(cacheKey);

                if (!string.IsNullOrEmpty(cachedResponse))
                {
                    var contentResult = new ContentResult
                    {
                        Content = cachedResponse,
                        ContentType = "appication/json",
                        StatusCode = 200
                    };
                    context.Result = contentResult;
                    return;
                }


                var executedContext = await next();
                if (executedContext.Result is OkObjectResult okObjectResult)
                {
                    await cacheService.CacheResponseAsync(cacheKey, okObjectResult.Value, TimeSpan.FromSeconds(_timeToLiveSeconds));
                }


            }
        }

        private string GenerateCacheKeyFromRequest(HttpRequest request)
        {
           var KeyBuilder = new StringBuilder();
           KeyBuilder.Append($"{request.Path}");


           foreach(var (key, value) in request.Query.OrderBy(x => x.Key))
            {
                KeyBuilder.Append($"|{key}-{value}");
            }
            return KeyBuilder.ToString();
        }
    }
}