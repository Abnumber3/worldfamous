using System;
using System.IO;
using System.Threading.Tasks;
using api.Errors;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Stripe;

namespace api.Controllers
{
    public class PaymentsController : BaseApiController
    {
        private readonly IPaymentService _paymentService;
        private readonly ILogger<PaymentsController> _logger;
        private readonly string _whSecret ="whsec_c70021eb67845a64eb9a53a5e396715f9e60e2ea4bd8e9d39ef7a8e7228ed2d0";

        public PaymentsController(
            IPaymentService paymentService,
            IConfiguration config,
            ILogger<PaymentsController> logger)
        {
            _paymentService = paymentService;
            _logger = logger;
            _whSecret = config["StripeSettings:WebhookSecret"];
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
            Request.EnableBuffering();
            var json = await new StreamReader(Request.Body).ReadToEndAsync();
            Request.Body.Position = 0;


            Event stripeEvent;

            try
            {
                stripeEvent = EventUtility.ConstructEvent(
                    json,
                    Request.Headers["Stripe-Signature"],
                    _whSecret
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

                        _logger.LogInformation(
                            "Stripe payment succeeded. PaymentIntentId={PaymentIntentId} Amount={Amount} Currency={Currency}",
                            intent.Id,
                            intent.Amount,
                            intent.Currency
                        );

                        var order = await _paymentService.UpdateOrderPaymentSucceeded(intent.Id);

                        if (order == null)
                        {
                            _logger.LogWarning(
                                "Payment succeeded but no order found to update. PaymentIntentId={PaymentIntentId}",
                                intent.Id
                            );
                        }
                        else
                        {
                            _logger.LogInformation(
                                "Order updated to payment succeeded. OrderId={OrderId} PaymentIntentId={PaymentIntentId}",
                                order.Id,
                                intent.Id
                            );
                        }

                        break;
                    }

                    case "payment_intent.payment_failed":
                    {
                        var intent = (PaymentIntent)stripeEvent.Data.Object;

                        _logger.LogWarning(
                            "Stripe payment failed. PaymentIntentId={PaymentIntentId} Amount={Amount} Currency={Currency}",
                            intent.Id,
                            intent.Amount,
                            intent.Currency
                        );

                        var order = await _paymentService.UpdateorderPaymentFailed(intent.Id);

                        if (order == null)
                        {
                            _logger.LogWarning(
                                "Payment failed but no order found to update. PaymentIntentId={PaymentIntentId}",
                                intent.Id
                            );
                        }
                        else
                        {
                            _logger.LogInformation(
                                "Order updated to payment failed. OrderId={OrderId} PaymentIntentId={PaymentIntentId}",
                                order.Id,
                                intent.Id
                            );
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
                _logger.LogError(ex, "Stripe webhook processing failed for event type {EventType}", stripeEvent.Type);
                return StatusCode(500);
            }

            return Ok();
        }
    }
}
