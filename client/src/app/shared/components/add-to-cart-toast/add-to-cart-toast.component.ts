import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IProduct } from '../../../shared/models/product';

@Component({
  selector: 'app-add-to-cart-toast',
  standalone: false,
  templateUrl: './add-to-cart-toast.component.html',
  styleUrls: ['./add-to-cart-toast.component.scss']
})
export class AddToCartToastComponent {
  @Input() product!: IProduct;
  @Input() quantity!: number;
  visible = false;

  show(product: IProduct, quantity: number) {
    this.product = product;
    this.quantity = quantity;
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }
}
