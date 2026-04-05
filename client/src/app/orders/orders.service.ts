import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../shared/models/order';
import { API_BASE_URL } from '../core/constants/api.constants';
import { map } from 'rxjs';
import { normalizeAssetUrl } from '../core/utils/url.utils';


@Injectable({
  providedIn: 'root'
})
export class OrdersService {

baseUrl = API_BASE_URL;

  constructor(private http: HttpClient) { }

  getOrdersForUser(){
    return this.http.get<Order[]>(this.baseUrl + 'orders').pipe(
      map(orders => orders.map(order => this.normalizeOrder(order)))
    );
  }

  getOrderDetailed(id: number){
    return this.http.get<Order>(this.baseUrl + 'orders/' + id).pipe(
      map(order => this.normalizeOrder(order))
    );
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
