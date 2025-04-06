import { Component, OnInit } from '@angular/core';
import { IProduct } from '../shared/models/product';
import { ShopService } from './shop.service';
import { ProductItemComponent } from './product-item/product-item.component';
import { CommonModule } from '@angular/common';
import { IType } from '../shared/models/productType';
import { ShopParams } from '../shared/models/shop.Params';


@Component({
  selector: 'app-shop',
  standalone: false,
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {

  products: IProduct[] = [];
  productType: IType[] = [];
  shopParams  = new ShopParams();
  totalCount: number = 0;
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
    this.shopService.getProducts(this.shopParams).subscribe((response)=>{
      this.products = response!.data;
      this.shopParams.pageNumber = response!.pageIndex;
      this.shopParams.pageSize = response!.pageSize;
      this.totalCount = response!.count;
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
    this.shopParams.typeId = typeId;
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

  this.shopParams.sort = value;
  this.getproducts();

          
  console.log('Sort value:', value);


}
onPageChanged(page: number) {
  const lastPage = this.getPageCount();
  if (page < 1 || page > lastPage) return; // 🛑 clamp the bounds

  if (page === this.shopParams.pageNumber) return;

  this.shopParams.pageNumber = page;
  console.log('Page clicked:', page);
  this.getproducts();
}


getPageCount(): number {
  return Math.ceil(this.totalCount / this.shopParams.pageSize);
}

getPageNumbers(): number[] {
  const totalPages = this.getPageCount();
  return Array.from({ length: totalPages }, (_, i) => i + 1);
}




}
