import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBasket } from '../shared/models/basket';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private baseUrl = 'https://localhost:5187/api/payments/';

  constructor(private http: HttpClient) {}

  /**
   * Creates or updates a Stripe PaymentIntent for the given basket
   * Backend endpoint: POST /api/payments/{basketId}
   */
  createPaymentIntent(basketId: string) {
    if (!basketId) {
      throw new Error('BasketId is required to create a payment intent');
    }

    return this.http.post<IBasket>(this.baseUrl + basketId, {});
  }
}
