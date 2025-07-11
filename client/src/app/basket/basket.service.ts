import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Basket, IBasket, IBasketItem } from '../shared/models/basket';
import { map } from 'rxjs';
import { IProduct } from '../shared/models/product';



@Injectable({
  providedIn: 'root'
})
export class BasketService {
baseUrl = 'http://localhost:5187/api/basket/';
private basketSource = new BehaviorSubject<IBasket | null>(null);
basket$ = this.basketSource.asObservable();

  constructor(private http: HttpClient) { }

getBasket(id: string) {
  return this.http.get<IBasket>(`${this.baseUrl}?id=${id}`).pipe(
    map((basket: IBasket) => {
      this.basketSource.next(basket);
      console.log(this.getCurrentBasketValue())
    })
  );
}

setBasket(basket: IBasket) {
  return this.http.post<IBasket>(this.baseUrl , basket).subscribe((response: IBasket)=>{
    this.basketSource.next(response);
    console.log(response);
  }, error => {
    console.log(error)
  })
}
getCurrentBasketValue() {
  return this.basketSource.value;
}

addItemToBasket(item: IProduct, quantity: number = 1){
  const itemToAdd: IBasketItem = this.mapProductToBasketItem(item, quantity);
  const basket = this.getCurrentBasketValue() ?? this.createBasket();
  basket!.items=this.addOrUpdateItem(basket!.items, itemToAdd, quantity);
  this.setBasket(basket!);
}


 private addOrUpdateItem(items: IBasketItem[], itemToAdd: IBasketItem, quantity: number): IBasketItem[] {
  console.log(items)
  const index = items.findIndex(i => i.id === itemToAdd.id);
  if(index === -1) {
    itemToAdd.quantity = quantity;
    items.push(itemToAdd);
  } else {
    items[index].quantity += quantity;
  }
  return items
  }


 private createBasket(): IBasket | null {
    const basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }



  private mapProductToBasketItem(item: any, quantity: any): IBasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
       quantity: quantity,
       type: item.productType
    }
  }

  }

