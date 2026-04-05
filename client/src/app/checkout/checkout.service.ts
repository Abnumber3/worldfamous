import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DeliveryMethod } from '../shared/models/deliveryMethod';
import { map, pipe } from 'rxjs';
import { Order, OrderToCreate } from '../shared/models/order';
import { API_BASE_URL } from '../core/constants/api.constants';
import { normalizeAssetUrl } from '../core/utils/url.utils';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
baseUrl = API_BASE_URL;




  constructor(private https: HttpClient) { }

  createOrder(order: OrderToCreate){
    return this.https.post<Order>(this.baseUrl + 'orders', order).pipe(
      map(createdOrder => this.normalizeOrder(createdOrder))
    );
  }

   



  getDeliveryMethods(){
    return this.https.get<DeliveryMethod[]>(this.baseUrl + 'orders/deliveryMethods').pipe(
      map(dm => {
        return dm.sort((a, b) => b.price - a.price);
      })
    )
  }

  private normalizeOrder(order: Order): Order {
    return {
      ...order,
      orderItems: order.orderItems.map(item => ({
        ...item,
        pictureUrl: normalizeAssetUrl(item.pictureUrl)
      }))
    };
  }

}

  
