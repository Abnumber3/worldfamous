import { Component, OnInit } from '@angular/core';
import { Order } from '../shared/models/order';
import { OrdersService } from '../orders/orders.service';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from '../core/services/breadcrumb.service';

@Component({
  selector: 'app-order-detailed',
  standalone: false,
  templateUrl: './order-detailed.component.html',
  styleUrl: './order-detailed.component.scss'
})
export class OrderDetailedComponent implements OnInit {
  order?: Order;

  constructor(
    private orderService: OrdersService,
    private route: ActivatedRoute,
    private bcService: BreadcrumbService
  ){}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    id && this.orderService.getOrderDetails(+id).subscribe({
      next : (order) =>{
        this.order = order;
        this.bcService.set('@orderDetailed', `Order# ${order.id} - ${order.status}` );
      }
    })
  }

}
