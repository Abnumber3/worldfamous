import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IPagination } from '../shared/models/pagination';
import { IProduct } from '../shared/models/product';
import { IType } from '../shared/models/productType';
import { delay, map } from 'rxjs/operators';
import { ShopParams } from '../shared/models/shopParams';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  baseUrl = 'https://localhost:5187/api/';
  products: IProduct[] = [];
  types : IType[]= [];
  pagination?: IPagination<IProduct[]>;
  shopParams = new ShopParams();
  productCache = new Map();

  constructor(private http: HttpClient) { }

  getProducts(useCache = true): Observable<IPagination<IProduct[]>>
   {

    
    if(!useCache) this.productCache = new Map();

    if(this.productCache.size > 0 && useCache){
      if(this.productCache.has(Object.values(this.shopParams).join('-'))){
        this.pagination = this.productCache.get(Object.values(this.shopParams).join('-'));
       if(this.pagination)return of(this.pagination);
      }
    }

    
    let params = new HttpParams();

    if (this.shopParams.typeId) {
      params = params.append('typeId', this.shopParams.typeId.toString());
    }

    if(this.shopParams.sort) {
      params = params.append('sort', this.shopParams.sort);
    }

    if(this.shopParams.search){
      params = params.append('search', this.shopParams.search);
    }
    params = params.append('pageIndex', this.shopParams.pageNumber.toString()); // <-- backend expects 'pageIndex'
    params = params.append('pageSize', this.shopParams.pageSize.toString());

    return this.http.get<IPagination<IProduct[]>>(this.baseUrl + 'Product', { observe: 'response', params })
    .pipe(
      map(response => {
        // this.products = response.body?.data || [];
        if(!response.body){
          throw new Error('No response body returned');
        }
      
        this.pagination = response.body || undefined;
        return response.body;
      })
    );
  }

  setShopParams(params: ShopParams){
    this.shopParams = params;
  }


  getShopParams(){
    return this.shopParams;
  }

  getProduct(id: number) {

    const product = [...this.productCache.values()]
    .reduce((acc, paginatedResult)=>{
      
    }, {})

    // if(product) return of(product);
    console.log(product);

    return this.http.get<IProduct>(this.baseUrl + 'product/' + id);
  }

  getTypes(){

    if(this.types.length > 0) return of(this.types);
    return this.http.get<IType[]>(this.baseUrl + 'product/types').pipe(
      map(types => this.types = types)
    )
  }
}
