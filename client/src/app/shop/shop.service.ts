import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IPagination } from '../shared/models/pagination';
import { IProduct } from '../shared/models/product';
import { IType } from '../shared/models/productType';
import { delay, map } from 'rxjs/operators';
import { ShopParams } from '../shared/models/shopParams';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  baseUrl = 'http://localhost:5187/api/';

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

    return this.http.get<IPagination>(this.baseUrl + 'Product', { observe: 'response', params })
    .pipe(
      map(response => {
        return response.body
      })
    );
  }
  getProduct(id: number) {
    return this.http.get<IProduct>(this.baseUrl + 'product/' + id);
  }

  getTypes(){
    return this.http.get<IType[]>(this.baseUrl + 'product/types');
  }
}
