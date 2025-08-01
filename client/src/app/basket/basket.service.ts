import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Basket, IBasket, IBasketItem, IBasketTotals } from '../shared/models/basket';
import { map } from 'rxjs';
import { IProduct } from '../shared/models/product';



@Injectable({
  providedIn: 'root'
})
export class BasketService {
baseUrl = 'http://localhost:5187/api/basket/';
private basketSource = new BehaviorSubject<IBasket | null>(null);
basket$ = this.basketSource.asObservable();
private basketTotalSource = new BehaviorSubject<IBasketTotals | null>(null);
basketTotal$ = this.basketTotalSource.asObservable();

  constructor(private http: HttpClient) { }

getBasket(id: string) {
  return this.http.get<IBasket>(`${this.baseUrl}?id=${id}`).pipe(
    map((basket: IBasket) => {
      this.basketSource.next(basket);
      this.calculateTotals();
     
    })
  );
}

setBasket(basket: IBasket) {
  return this.http.post<IBasket>(this.baseUrl , basket).subscribe((response: IBasket)=>{
    this.basketSource.next(response);
    this.calculateTotals();
  }, error => {
    console.log(error)
  })
}
getCurrentBasketValue() {
  return this.basketSource.value;
}

incrementItemQuantity(item: IBasketItem) {
  const basket = this.getCurrentBasketValue();
  const foundItemIndex = basket?.items.findIndex(x => x.id === item.id);
  basket!.items[foundItemIndex!].quantity++;
  this.setBasket(basket!);
}

decrementItemQuantity(item: IBasketItem) {
  const basket = this.getCurrentBasketValue();
  const foundItemIndex = basket?.items.findIndex(x => x.id === item.id);
  if(basket!.items[foundItemIndex!].quantity > 1) {
    basket!.items[foundItemIndex!].quantity--;
    this.setBasket(basket!);
  } else {
    this.removeItemFromBasket(item);
  }
}

removeItemFromBasket(item: IBasketItem) {
  const basket = this.getCurrentBasketValue();
  if (basket?.items.some(x => x.id === item.id)) {
    basket.items = basket.items.filter(i => i.id !== item.id);
    if (basket.items.length > 0) {
      this.setBasket(basket);
    } else {
      this.deleteBasket(basket);
    }
  }
}

deleteBasket(basket: IBasket) {
  return this.http.delete(this.baseUrl + 'basket?id=' + basket.id).subscribe(() => {
    this.basketSource.next(null);
    this.basketTotalSource.next(null);
    localStorage.removeItem('basket_id');
  }, error => {
    console.log(error);
  });
}

private calculateTotals() {
const basket = this.getCurrentBasketValue();
const shipping = 0;
const subtotal = basket?.items.reduce((a, b) => (b.price * b.quantity) + a, 0) ?? 0;
const total = subtotal + shipping;
this.basketTotalSource.next({shipping, subtotal, total});

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

