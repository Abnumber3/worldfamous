import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBasket } from '../shared/models/basket';
import { API_BASE_URL } from '../core/constants/api.constants';
import { map } from 'rxjs';
import { normalizeAssetUrl } from '../core/utils/url.utils';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private baseUrl = `${API_BASE_URL}payments/`;

  constructor(private http: HttpClient) {}

  /**
   * Creates or updates a Stripe PaymentIntent for the given basket
   * Backend endpoint: POST /api/payments/{basketId}
   */
  createPaymentIntent(basketId: string) {
    if (!basketId) {
      throw new Error('BasketId is required to create a payment intent');
    }

    return this.http.post<IBasket>(this.baseUrl + basketId, {}).pipe(
      map(basket => ({
        ...basket,
        items: basket.items.map(item => ({
          ...item,
          pictureUrl: normalizeAssetUrl(item.pictureUrl)
        }))
      }))
    );
  }
}
