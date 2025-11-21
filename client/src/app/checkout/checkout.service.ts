import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {Order, OrderToCreate } from '../shared/models/orderToCreate';


@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
baseUrl = 'https://localhost:5187/api/'




  constructor(private https: HttpClient) { }

    createOrder(order: OrderToCreate) {
    return this.http.post<Order>(this.baseUrl + 'orders', order);
  }



  //  getDeliveryMethods() {
  //   return this.http.get<DeliveryMethod[]>(this.baseUrl + 'orders/deliveryMethods').pipe(
  //     map(dm => {
  //       return dm.sort((a, b) => b.price - a.price)
  //     })
  //   )
  // }



  };
