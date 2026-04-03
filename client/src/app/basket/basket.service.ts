import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Basket, IBasket, IBasketItem, IBasketTotals } from '../shared/models/basket';
import { IProduct } from '../shared/models/product';
import { DeliveryMethod } from '../shared/models/deliveryMethod';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  baseUrl = 'https://localhost:5187/api/basket/';

  private basketSource = new BehaviorSubject<IBasket | null>(null);
  basket$ = this.basketSource.asObservable();

  private basketTotalSource = new BehaviorSubject<IBasketTotals | null>(null);
  basketTotal$ = this.basketTotalSource.asObservable();

  constructor(private http: HttpClient) {}

  // -------------------- API --------------------

  getBasket(id: string) {
    return this.http.get<IBasket>(`${this.baseUrl}?id=${id}`).pipe(
      map(basket => {
        this.basketSource.next(basket);
        this.calculateTotals();
        return basket;
      })
    );
  }

  setBasket(basket: IBasket) {
    return this.http.post<IBasket>(this.baseUrl, basket).pipe(
      tap(response => {
        this.basketSource.next(response);
        this.calculateTotals();
      })
    );
  }

  deleteBasket(basket: IBasket) {
    return this.http.delete(this.baseUrl + '?id=' + basket.id).subscribe({
      next: () => this.deleteLocalBasket(),
      error: error => console.log(error)
    });
  }

  

  // -------------------- STATE --------------------

  getCurrentBasketValue() {
    return this.basketSource.value;
  }

  deleteLocalBasket() {
    this.basketSource.next(null);
    this.basketTotalSource.next(null);
    localStorage.removeItem('basket_id');
  }

  // -------------------- MUTATIONS --------------------

  addItemToBasket(product: IProduct, quantity = 1, size?: string) {
    const basket = this.getCurrentBasketValue() ?? this.createBasket();
    const item = this.mapProductToBasketItem(product, quantity, size);

    basket.items = this.addOrUpdateItem(basket.items, item, quantity);

    this.setBasket(basket).subscribe();
  }

  incrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    if (!basket) return;

    const index = basket.items.findIndex(x => this.isSameBasketItem(x, item));
    if (index === -1) return;

    basket.items[index].quantity++;

    this.setBasket(basket).subscribe();
  }

  removeItemFromBasket(itemToRemove: IBasketItem, quantity = 1) {
    const basket = this.getCurrentBasketValue();
    if (!basket) return;

    const item = basket.items.find(x => this.isSameBasketItem(x, itemToRemove));
    if (!item) return;

    item.quantity -= quantity;

    if (item.quantity <= 0) {
      basket.items = basket.items.filter(i => !this.isSameBasketItem(i, itemToRemove));
    }

    if (basket.items.length > 0) {
      this.setBasket(basket).subscribe();
    } else {
      // ✅ PRESERVES STRIPE + DELIVERY STATE
      this.basketSource.next({
        ...basket,
        items: [],
        shippingPrice: 0
      });
      this.basketTotalSource.next({ shipping: 0, subtotal: 0, total: 0 });
    }
  }

  setShippingPrice(deliveryMethod: DeliveryMethod) {
    const basket = this.getCurrentBasketValue();
    if (!basket) return;

    basket.shippingPrice = deliveryMethod.price;
    basket.deliveryMethodId = deliveryMethod.id;

    this.setBasket(basket).subscribe();
  }

  // -------------------- HELPERS --------------------

  private calculateTotals() {
    const basket = this.getCurrentBasketValue();
    const subtotal =
      basket?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) ?? 0;

    const shipping = basket?.shippingPrice ?? 0;
    const total = subtotal + shipping;

    this.basketTotalSource.next({ shipping, subtotal, total });
  }

  private addOrUpdateItem(
    items: IBasketItem[],
    itemToAdd: IBasketItem,
    quantity: number
  ): IBasketItem[] {
    const index = items.findIndex(i => this.isSameBasketItem(i, itemToAdd));

    if (index === -1) {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    } else {
      items[index].quantity += quantity;
    }

    return items;
  }

  private createBasket(): IBasket {
    const basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }

  private mapProductToBasketItem(item: IProduct, quantity: number, size?: string): IBasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      quantity,
      type: item.productType,
      size: size?.trim() || undefined
    };
  }

  private isSameBasketItem(left: IBasketItem, right: IBasketItem): boolean {
    return left.id === right.id && this.normalizeSize(left.size) === this.normalizeSize(right.size);
  }

  private normalizeSize(size?: string): string {
    return size?.trim().toLowerCase() ?? '';
  }
}
