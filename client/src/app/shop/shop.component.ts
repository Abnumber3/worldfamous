import { Component, OnInit } from '@angular/core';
import { IProduct } from '../shared/models/product';
import { ShopService } from './shop.service';
import { ProductItemComponent } from './product-item/product-item.component';
import { CommonModule } from '@angular/common';
import { IType } from '../shared/models/productType';

@Component({
  selector: 'app-shop',
  standalone: false,
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {

  products: IProduct[] = [];
  productType: IType[] = [];
  typeIdSelected?: number;
  sortSelected = 'name';
  sortOptions = [
    {name: 'Alphabetical', value: 'name'},
    {name: 'Price: Low to High', value: 'priceAsc'},
    {name: 'Price: High to Low', value: 'priceDesc'},
  ]


  constructor(private shopService: ShopService) { }

  ngOnInit() {
   this.getproducts();
   this.getTypes();

  }

  getproducts() {
    this.shopService.getProducts(this.typeIdSelected, this.sortSelected).subscribe((response)=>{
      this.products = response!.data;
    }, error => {
      console.log(error);
    })
  }

  getTypes(){
    this.shopService.getTypes().subscribe((response)=>{
      this.productType = [{id: 0, name: 'All'}, ...response!];
    }, error => {
      console.log(error);
    })
  }

  onTypeSelected(typeId: number) {
    this.typeIdSelected = typeId;
    this.getproducts();
    console.log(typeId);
  }



// Filter Panel for moblile devices
  showFilterPanel: boolean = false;

toggleFilterPanel() {
  this.showFilterPanel = !this.showFilterPanel;
}

onSortSelected(event: Event) {
  const selectElement = event.target as HTMLSelectElement;
  const value = selectElement.value;

  this.sortSelected = value;
  this.getproducts();

          
  console.log('Sort value:', value);


}
}
