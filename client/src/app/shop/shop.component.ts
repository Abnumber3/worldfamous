import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IProduct } from '../shared/models/product';
import { ShopService } from './shop.service';
import { ProductItemComponent } from './product-item/product-item.component';
import { CommonModule } from '@angular/common';
import { IType } from '../shared/models/productType';
import { PaginationControlsComponent } from '../shared/pagination-controls.component';
import { ShopParams } from '../shared/models/shopParams';
import { SearchNormalizerService } from './search-normlizer.service';



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
  shopParams: ShopParams;
  totalCount: number = 0;
  sortOptions = [
    {name: 'Alphabetical', value: 'name'},
    {name: 'Price: Low to High', value: 'priceAsc'},
    {name: 'Price: High to Low', value: 'priceDesc'},
  ]

  hasSearched: boolean = false;


  constructor(
    private shopService: ShopService,
    private searchNormalizer: SearchNormalizerService
  ) { 
    this.shopParams = this.shopService.getShopParams();
  }

  ngOnInit() {
   this.getproducts();
   this.getTypes();

  }

  getproducts() {
    this.shopService.getProducts().subscribe({
      next: (response) => {
        this.products = response!.data;
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
  const params = this.shopService.getShopParams();

  params.typeId = typeId;
  params.search = '';
  params.pageNumber = 1;

  this.shopService.setShopParams(params);
  this.shopParams = params;

  this.hasSearched = false;
  this.getproducts();
}




// Filter Panel for moblile devices
  showFilterPanel: boolean = false;

toggleFilterPanel() {
  this.showFilterPanel = !this.showFilterPanel;
}

onSortSelected(event: Event) {
  const selectElement = event.target as HTMLSelectElement;
  const value = selectElement.value;

  const params = this.shopService.getShopParams();

  params.sort = value;
  params.pageNumber = 1;

  this.shopService.setShopParams(params);
  this.shopParams = params;

  this.getproducts();
}


onPageChanged(page: number) {
  const params = this.shopService.getShopParams();

  if (page === params.pageNumber) return;

  params.pageNumber = page;

  this.shopService.setShopParams(params);
  this.shopParams = params;

  this.getproducts();
}




getDisplayedCount(): number {
  const currentTotal = this.shopParams.pageNumber * this.shopParams.pageSize;
  return currentTotal > this.totalCount ? this.totalCount : currentTotal;
}





onSearch() {
  const searchTerm = this.search.nativeElement.value.trim();
  const normalizedTerm = this.searchNormalizer.normalize(searchTerm);

  const params = this.shopService.getShopParams();

  params.search = normalizedTerm;
  params.pageNumber = 1;

  if (normalizedTerm.length > 0) {
    params.typeId = 0;
  }

  this.shopService.setShopParams(params);
  this.shopParams = params;

  this.hasSearched = true;
  this.getproducts();
}






onClear() {
  const params = new ShopParams();

  this.shopService.setShopParams(params);
  this.shopParams = params;

  this.hasSearched = false;
  this.search.nativeElement.value = '';

  this.getproducts();
}

}
