import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../shared/models/order';
import { OrdersService } from '../orders/orders.service';
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
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;

    this.orderService.getOrderDetailed(+id).subscribe({
      next: order => {
        this.order = order;
        this.bcService.set('@orderDetailed', `Order# ${order.id} - ${order.status}`);
      }
    });
  }
}
