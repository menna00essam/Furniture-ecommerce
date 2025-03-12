import { Injectable } from '@angular/core';
import { product } from '../Models/product.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap, take, map } from 'rxjs/operators';

enum SortOptions {
  Default = 'Default',
  LowToHigh = 'Price: Low to High',
  HighToLow = 'Price: High to Low',
  Newest = 'Newest',
  Oldest = 'Oldest',
  AtoZ = 'Alphabetically: A to Z',
  ZtoA = 'Alphabetically: Z to A',
}
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsSubject = new BehaviorSubject<product[]>([]);
  apiUrl = 'http://localhost:5000/products';
  products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Fetch products from API
  getProducts(
    page: number = 1,
    limit: number = 16,
    categories: string[] = [],
    sortBy: SortOptions = SortOptions.Default
  ): Observable<any> {
    let url = `${this.apiUrl}?categories=${
      categories.length ? `${categories.join(',')}` : ''
    }&page=${page}&limit=${limit}`;

    // Append sorting parameters based on the selected sorting option
    switch (sortBy) {
      case SortOptions.LowToHigh:
        url += '&sortBy=price&order=asc';
        break;
      case SortOptions.HighToLow:
        url += '&sortBy=price&order=desc';
        break;
      case SortOptions.Newest:
        url += '&sortBy=date&order=desc';
        break;
      case SortOptions.Oldest:
        url += '&sortBy=date&order=asc';
        break;
      case SortOptions.AtoZ:
        url += '&sortBy=name&order=asc';
        break;
      case SortOptions.ZtoA:
        url += '&sortBy=name&order=desc';
        break;
    }

    console.log(url);

    return this.http
      .get<{ data: { totalProducts: number; products: any[] } }>(url)
      .pipe(
        tap((response) => {
          if (!response.data || !response.data.products) {
            console.error('Invalid API response:', response);
            return;
          }

          const apiProducts = response.data.products.map((p) => ({
            id: p._id,
            name: p.productName,
            images: p.productImages,
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
          return of([]);
        })
      );
  }

  // Get a single product by ID
  getProduct(productId: string): Observable<product> {
    return this.http
      .get<{ status: string; data: { product: any } }>(
        `${this.apiUrl}/${productId}`
      )
      .pipe(
        map(({ data }) => ({
          id: data.product._id,
          name: data.product.productName,
          images: data.product.productImages,
          subTitle: data.product.productSubtitle,
          price: data.product.productPrice,
          quantity: data.product.productQuantity,
          categories: data.product.productCategories.map(
            (cat: { catName: string }) => cat.catName
          ),
          date: data.product.productDate,
          sale: data.product.productSale,
          description: data.product.productDescription,
          colors: data.product.colors,
          sizes: data.product.sizes,
          brand: data.product.brand,
        })),
        catchError((error) => {
          console.error('Error fetching product:', error);
          return of(null as unknown as product);
        })
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

  searchProducts(query: string): Observable<{ id: string; value: string }[]> {
    if (!query.trim()) return of([]);

    return this.http
      .get<{ data: any[] }>(`${this.apiUrl}/search?query=${query}`)
      .pipe(
        map((response) =>
          response.data.map((p) => ({ id: p._id, value: p.productName }))
        ),
        catchError((error) => {
          console.error('Search error:', error);
          return of([]);
        })
      );
  }
}
