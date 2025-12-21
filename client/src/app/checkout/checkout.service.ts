import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DeliveryMethod } from '../shared/models/deliveryMethod';
import { map, pipe } from 'rxjs';
import { Order, OrderToCreate } from '../shared/models/order';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
baseUrl = 'https://localhost:5187/api/'




  constructor(private https: HttpClient) { }

  createOrder(order: OrderToCreate){
    return this.https.post<Order>(this.baseUrl + 'orders', order)
  }

   



  getDeliveryMethods(){
    return this.https.get<DeliveryMethod[]>(this.baseUrl + 'orders/deliveryMethods').pipe(
      map(dm => {
        return dm.sort((a, b) => b.price - a.price);
      })
    )
  }

}

  
