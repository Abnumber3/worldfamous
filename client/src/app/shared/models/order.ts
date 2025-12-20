import { IAddress } from "./address";


export interface OrderToCreate {
    basketId: string;
    deliveryMethodId: number;
    shipToAddress: IAddress;
}

export interface OrderItem {
    productId: number;
    productName: string;
    picureurl: string;
    price: number;
    quntity: number;    
}


export interface Order {
    id: number;
    buyerEmail: string;
    orderDate: Date;    
    shipToAddress:IAddress
    deliveryMethod: string;
    shippingPrice: number;
    orderItems: OrderItem[];
    subtotal: number;
    total: number;
    status: string;


}