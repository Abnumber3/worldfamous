import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DeliveryMethod } from '../shared/models/deliveryMethod';
import { map, pipe } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
baseUrl = 'https://localhost:5187/api/'




  constructor(private https: HttpClient) { }

   



  getDeliveryMethods(){
    return this.https.get<DeliveryMethod[]>(this.baseUrl + 'orders/deliveryMethods').pipe(
      map(dm => {
        return dm.sort((a, b) => b.price - a.price);
      })
    )
  }

}

  
