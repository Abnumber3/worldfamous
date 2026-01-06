import { v4 as uuid, UUIDTypes } from 'uuid';




export interface IBasket {
  id: string
  items: IBasketItem[]
  clientSecret?: string
  paymentIntentId?: string
  deliveryMethodId?: number
}

export interface IBasketItem {
  id: number
  productName: string
  price: number
  quantity: number
  pictureUrl: string
  type: string
}


export class Basket implements IBasket {
  id =  uuid();
  items: IBasketItem[] = [];
}

export interface IBasketTotals {
  shipping: number;
  subtotal: number;
  total: number;
}
