import { Component, OnInit } from '@angular/core';
import { Order } from '../shared/models/order';
import { OrdersService } from './orders.service';


@Component({
  selector: 'app-orders',
  standalone: false,
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];

  constructor(private orderService: OrdersService) {}

  ngOnInit(): void {
    this.getOrders();
  }

  // getOrders() {
  //   this.orderService.getOrdersForUser().subscribe({
  // next: orders => this.orders = orders
  //   });
  // }

  getOrders(){
    this.orderService.getOrdersForUser().subscribe({
      next: (orders) =>{
        this.orders = orders;
      }
    })
  }

}
