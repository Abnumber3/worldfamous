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
  shopParams  = new ShopParams();
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
  ) { }

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
    console.log(typeId);
    this.shopParams.search = '';
    this.shopParams.pageNumber = 1; // reset page when filtering
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
  this.shopParams.sort = value;
  this.shopParams.pageNumber = 1;
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





onSearch() {
  const searchTerm = this.search.nativeElement.value.trim();
  const normalizedTerm = this.searchNormalizer.normalize(searchTerm);
  this.hasSearched = true;
  this.shopParams.search = normalizedTerm;
  this.shopParams.pageNumber = 1;

  // Only reset typeId (search globally) IF there's actually a search term
  if (normalizedTerm.length > 0) {
    this.shopParams.typeId = 0;
  }
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
