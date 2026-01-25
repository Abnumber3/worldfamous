using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using api.Errors;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Stripe;

namespace api.Controllers
{
    public class PaymentsController : BaseApiController
    {
        private readonly IPaymentService _paymentService;
        private readonly ILogger<PaymentsController> _logger;

        // Hard-coded for local testing
        private const string WebhookSecret = "";

        public PaymentsController(
            IPaymentService paymentService,
            ILogger<PaymentsController> logger)
        {
            _paymentService = paymentService;
            _logger = logger;
        }

        [Authorize]
        [HttpPost("{basketId}")]
        public async Task<ActionResult<CustomerBasket>> CreateOrUpdatePaymentIntent(string basketId)
        {
            var basket = await _paymentService.CreateOrUpdatePaymentIntent(basketId);

            if (basket == null)
            {
                return BadRequest(new ApiResponse(400, "Problem with your basket"));
            }

            return basket;
        }

        [HttpPost("webhook")]
        public async Task<ActionResult> StripeWebhook()
        {
            // Stripe requires raw request body for signature verification
            Request.EnableBuffering();

            string json;
            using (var memoryStream = new MemoryStream())
            {
                await Request.Body.CopyToAsync(memoryStream);
                json = Encoding.UTF8.GetString(memoryStream.ToArray());
                Request.Body.Position = 0;
            }

            Event stripeEvent;

            try
            {
                stripeEvent = EventUtility.ConstructEvent(
                    json,
                    Request.Headers["Stripe-Signature"],
                    WebhookSecret,
                    throwOnApiVersionMismatch: false

                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Stripe webhook signature verification failed");
                return BadRequest();
            }

            try
            {
                switch (stripeEvent.Type)
                {
                    case "payment_intent.succeeded":
                    {
                        var intent = (PaymentIntent)stripeEvent.Data.Object;

                        _logger.LogInformation("Stripe payment succeeded: {PaymentIntentId}", intent.Id);

                        var order = await _paymentService.UpdateOrderPaymentSucceeded(intent.Id);

                        if (order == null)
                        {
                            _logger.LogWarning("No order found for PaymentIntent {PaymentIntentId}", intent.Id);
                        }
                        else
                        {
                            _logger.LogInformation("Order {OrderId} marked PaymentReceived", order.Id);
                        }

                        break;
                    }

                    case "payment_intent.payment_failed":
                    {
                        var intent = (PaymentIntent)stripeEvent.Data.Object;

                        _logger.LogWarning("Stripe payment failed: {PaymentIntentId}", intent.Id);

                        var order = await _paymentService.UpdateorderPaymentFailed(intent.Id);

                        if (order == null)
                        {
                            _logger.LogWarning("No order found for PaymentIntent {PaymentIntentId}", intent.Id);
                        }
                        else
                        {
                            _logger.LogInformation("Order {OrderId} marked PaymentFailed", order.Id);
                        }

                        break;
                    }

                    default:
                        _logger.LogInformation("Unhandled Stripe event type: {EventType}", stripeEvent.Type);
                        break;
                }
            }
            catch (Exception ex)
            {
                // If this throws, Stripe will retry — which is what we want
                _logger.LogError(ex, "Stripe webhook processing failed for event type {EventType}", stripeEvent.Type);
                return StatusCode(500);
            }

            // Stripe only stops retrying when it receives 200 OK
            return Ok();
        }
    }
}
