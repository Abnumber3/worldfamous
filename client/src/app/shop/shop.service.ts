import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IPagination } from '../shared/models/pagination';
import { IProduct } from '../shared/models/product';
import { IType } from '../shared/models/productType';
import { delay, map } from 'rxjs/operators';
import { ShopParams } from '../shared/models/shopParams';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  baseUrl = 'https://localhost:5187/api/';
  products: IProduct[] = [];
  types : IType[]= [];
  pagination?: IPagination<IProduct[]>;
  shopParams = new ShopParams();

  constructor(private http: HttpClient) { }

  getProducts(shopParams:ShopParams) {
    let params = new HttpParams();

    if (shopParams.typeId) {
      params = params.append('typeId', shopParams.typeId.toString());
    }

    if(shopParams.sort) {
      params = params.append('sort', shopParams.sort);
    }

    if(shopParams.search){
      params = params.append('search', shopParams.search);
    }
    params = params.append('pageIndex', shopParams.pageNumber.toString()); // <-- backend expects 'pageIndex'
    params = params.append('pageSize', shopParams.pageSize.toString());

    return this.http.get<IPagination<IProduct[]>>(this.baseUrl + 'Product', { observe: 'response', params })
    .pipe(
      map(response => {
        this.products = response.body?.data || [];
        return response.body;
      })
    );
  }
  getProduct(id: number) {

    const product = this.products.find(p => p.id === id);

    if(product) return of(product);

    return this.http.get<IProduct>(this.baseUrl + 'product/' + id);
  }

  getTypes(){

    if(this.types.length > 0) return of(this.types);
    return this.http.get<IType[]>(this.baseUrl + 'product/types').pipe(
      map(types => this.types = types)
    )
  }
}
