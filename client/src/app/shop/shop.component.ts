import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IProduct } from '../shared/models/product';
import { ShopService } from './shop.service';
import { ProductItemComponent } from './product-item/product-item.component';
import { CommonModule } from '@angular/common';
import { IType } from '../shared/models/productType';
import { PaginationControlsComponent } from '../shared/pagination-controls.component';
import { ShopParams } from '../shared/models/shopParams';



@Component({
  selector: 'app-shop',
  standalone: false,
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {
  @ViewChild('search') search!: ElementRef;
  products: IProduct[] = [];
  productType: IType[] = [];
  shopParams  = new ShopParams();
  totalCount: number = 0;
  sortOptions = [
    {name: 'Alphabetical', value: 'name'},
    {name: 'Price: Low to High', value: 'priceAsc'},
    {name: 'Price: High to Low', value: 'priceDesc'},
  ]

  hasSearched: boolean = false;


  constructor(private shopService: ShopService) { }

  ngOnInit() {
   this.getproducts();
   this.getTypes();

  }

  getproducts() {
    this.shopService.getProducts(this.shopParams).subscribe({
      next: (response) => {
        this.products = response!.data;
        this.shopParams.pageNumber = response!.pageIndex;
        this.shopParams.pageSize = response!.pageSize;
        this.totalCount = response!.count;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      }
    });
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
    this.shopParams.pageNumber = 1; // reset page when filtering
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
  if (page === this.shopParams.pageNumber) return;

  this.shopParams.pageNumber = page;
  console.log('Page clicked:', page);
  this.getproducts();
}



getDisplayedCount(): number {
  const currentTotal = this.shopParams.pageNumber * this.shopParams.pageSize;
  return currentTotal > this.totalCount ? this.totalCount : currentTotal;
}

onSearch(){
  this.shopParams.search = this.search.nativeElement.value;
  this.hasSearched = true;
  this.getproducts();
}

onClear(){
  this.shopParams.search = '';
  this.hasSearched = false;
  this.shopParams = new ShopParams();
  this.getproducts();
  this.search.nativeElement.value = '';
  this.shopParams.pageNumber = 1; // reset page when filtering
}
}
