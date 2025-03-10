import { Injectable } from '@angular/core';
import { product } from '../Models/product.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap, take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsSubject = new BehaviorSubject<product[]>([]);
  products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Fetch products from API and update state
  getProducts(): Observable<any> {
    return this.http
      .get<{ data: { products: any[] } }>('http://localhost:5000/products')
      .pipe(
        tap((response) => {
          const apiProducts = response.data.products.map((p) => ({
            id: p._id,
            name: p.productName,
            images: p.productImages.length
              ? p.productImages
              : ['assets/images/no-image.jpg'],
            subTitle: p.productSubtitle,
            price: p.productPrice,
            quantity: p.productQuantity,
            categories: p.productCategories.map(
              (cat: { catName: string }) => cat.catName
            ),
            date: p.productDate,
            sale: p.productSale,
          }));
          this.productsSubject.next(apiProducts);
        }),
        catchError((error) => {
          console.error('Error fetching products:', error);
          return of([]); // Return empty array if API fails
        })
      );
  }

  // Get product names (reactively)
  getProductNames(): Observable<{ id: string; value: string }[]> {
    return this.products$.pipe(
      map((products: product[]) =>
        products.map((p) => ({ id: p.id, value: p.name }))
      )
    );
  }

  // Get a single product by ID reactively
  getProduct(productId: string): Observable<product | undefined> {
    return this.products$.pipe(
      take(1), // Take only the latest value
      map((products) => products.find((p) => p.id === productId)) // Transform the array to a single product
    );
  }

  getMinPrice(): Observable<number> {
    return this.products$.pipe(
      map((products) => products.map((p) => this.getEffectivePrice(p))),
      map((prices) => {
        if (!prices.length) return 0;
        else return Math.min(...prices);
      })
    );
  }

  getMaxPrice(): Observable<number> {
    return this.products$.pipe(
      map((products) => products.map((p) => this.getEffectivePrice(p))),
      map((prices) => {
        if (!prices.length) return 0;
        return Math.max(...prices);
      })
    );
  }

  private getEffectivePrice(product: product): number {
    return product.sale
      ? product.price * (1 - product.sale / 100)
      : product.price;
  }
}
