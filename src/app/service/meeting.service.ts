import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { ProductOptionCreateDto, ProductRequestCreateDto } from 'src/app/model/product';
import { Category } from '../model/category';
import { Product, ProductCreateDto, ProductRequest, ProductSearchDto, ProductUpdateDto } from '../model/product';
import { Pagination, PaginationSearchDto } from './../model/pagination';
import { Hashtag, ProductManageDto, ProductStatus } from './../model/product';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  urlPrefix = UrlService.prefix;

  constructor(
    private http: HttpClient
  ) { }

  addProduct(dto: ProductCreateDto): Observable<Product> {
    return this.http.post<Product>(`/api/products`, dto);
  }

  updateProductSortOrder(orders: { id: number, dto: ProductUpdateDto }[]) {
    const requests: Observable<any>[] = [];
    orders.forEach(order => {
      return requests.push(this.http.put(`/api/products/management/${order.id}`, order.dto))
    })
    if (requests.length === 0) return of([]);
    return forkJoin(requests);
  }

  updateProduct(id: number, dto: ProductUpdateDto, addedOptions?: ProductOptionCreateDto[], removedOptions?: ProductOptionCreateDto[]): Observable<Product> {
    if (addedOptions && removedOptions) {
      const data = { ...dto, addedOptions, removedOptions };
      return this.http.put<Product>(`/api/products/${id}`, data);
    } else {
      return this.http.put<Product>(`/api/products/${id}`, dto);
    }
  }

  manageProduct(id: number, dto: ProductManageDto) {
    return this.http.put(`/api/products/management/${id}`, dto)
  }

  getProduct(productId: number, userId?: number): Observable<Product> {
    if (userId) return this.http.get<Product>(`${this.urlPrefix}/products/product/${productId}/user/${userId}`)
    else return this.http.get<Product>(`${this.urlPrefix}/products/product/${productId}`)
  }

  search(search: ProductSearchDto): Observable<Pagination<Product>> {
    const queries = Object.keys(search).filter(key => !!search[key]).map(key => {
      const value = search[key];
      if (Array.isArray(value)) return `${key}=['${value}']`;
      else return `${key}=${value}`;
    }).join('&');
    return this.http.get<Pagination<Product>>(`/api/products?${queries}`);
  }

  requestProduct(requestProduct: ProductRequestCreateDto) {
    return this.http.post(`${this.urlPrefix}/product-requests/`, requestProduct)
  }

  isChecked(productId: number): Observable<boolean> {
    return this.http.get<boolean>(`/api/product-requests/isChecked/${productId}`);
  }

  checkRequestProduct(id: number, isChecked: boolean) {
    return this.http.put(`/api/product-requests/${id}`, { isChecked });
  }

  getProductRequests(search: PaginationSearchDto): Observable<Pagination<ProductRequest>> {
    return this.http.get<Pagination<ProductRequest>>(`/api/product-requests?page=${search.page}&limit=${search.limit}`)
  }

  getHostedProducts(page: number, limit: number, status: ProductStatus, hostId: number): Observable<Pagination<Product>> {
    return this.http.get<Pagination<Product>>(`/api/products?page=${page}&limit=${limit}&status=${status}&hostId=${hostId}`)
  }

  deleteProduct(id: number) {
    return this.http.delete(`/api/products/${id}`);
  }

  getLikeProducts(search: PaginationSearchDto): Observable<Pagination<Product>> {
    return this.http.get<Pagination<Product>>(`/api/products/likes?page=${search.page}&limit=${search.limit}&status=${ProductStatus.ENTERED}`)
  }

  getStatusLabel(status) {
    switch (status) {
      case ProductStatus.ALL: return "전체";
      case ProductStatus.CREATED: return "생성";
      case ProductStatus.INSPACTED: return "검토";
      case ProductStatus.ENTERED: return "전시";
      case ProductStatus.UPDATED: return "수정";
      case ProductStatus.DISABLED: return "비활성";
      case ProductStatus.COMPLETED: return "완료";
      case ProductStatus.DELETED: return "삭제";
    }
  }

  searchHashtag(search: PaginationSearchDto): Observable<Pagination<Hashtag>> {
    return this.http.get<Pagination<Hashtag>>(`/api/hashtags?page=${search.page}&limit=${search.limit}`);
  }

  searchCategory(search: PaginationSearchDto): Observable<Pagination<Category>> {
    return this.http.get<Pagination<Category>>(`/api/categories?page=${search.page}&limit=${search.limit}`);
  }
}