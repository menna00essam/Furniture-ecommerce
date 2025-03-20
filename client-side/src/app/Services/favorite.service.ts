import { Injectable } from '@angular/core';
import { product } from '../Models/product.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { productFavorite } from '../Models/productFavorite.model';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private apiUrl = 'http://localhost:5000/users';
  private favoritesSubject = new BehaviorSubject<productFavorite[]>([]);
  favorites$ = this.favoritesSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.isLoggedIn$.subscribe((status) => {
      if (status) {
        this.loadFavorites();
        console.log(5);
      }
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  private loadFavorites(): void {
    this.getFavorites().subscribe();
  }
  // Fetch favorites from API and update state
  getFavorites(): Observable<any> {
    return this.http
      .get<{ data: { favourites: any[] } }>(`${this.apiUrl}/favourites`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        tap((response) => {
          console.log(response);
          const apiFavorites = response.data.favourites.map((p) => ({
            id: p._id,
            name: p.productName,
            images: p.productImages.length
              ? p.productImages
              : ['/images/products/1.png'],
            subTitle: p.productSubtitle,
            price: p.productPrice,
          }));
          this.favoritesSubject.next(apiFavorites);
        }),
        catchError((error) => {
          console.error('Error fetching favorites:', error);
          return of([]); // Return empty array if API fails
        })
      );
  }

  // Toggle favorite and update state
  toggleFavourite(productId: string): Observable<productFavorite[]> {
    const url = `${this.apiUrl}/toggle-favourites`;
    const headers = this.getAuthHeaders();
    const body = { productId };

    console.log(
      '%c[FavoriteService] Toggling Favorite',
      'color: blue; font-weight: bold;'
    );
    console.log('→ Sending Request to:', url);
    console.log('→ Headers:', headers);
    console.log('→ Body:', body);

    return this.http
      .post<{
        status: string;
        message: string;
        data: { favourites: string[] };
      }>(url, body, { headers })
      .pipe(
        tap((response) =>
          console.log(
            '%c[API Response]',
            'color: green; font-weight: bold;',
            response
          )
        ),
        map((response) => {
          if (response?.data?.favourites) {
            const updatedFavorites = response.data.favourites.map(
              (id) => ({ id } as product)
            );
            this.favoritesSubject.next(updatedFavorites);
            return updatedFavorites;
          }
          return [];
        }),
        catchError((error) => {
          console.error(
            '%c[API Error]',
            'color: red; font-weight: bold;',
            error
          );
          return of(this.favoritesSubject.getValue());
        })
      );
  }

  // Check if a product is in favorites
  isInFavorites(productId: string): boolean {
    return this.favoritesSubject.getValue().some((p) => p.id === productId);
  }
}
