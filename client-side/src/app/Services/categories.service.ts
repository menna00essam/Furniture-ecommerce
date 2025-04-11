import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { category } from '../Models/category.model';

import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private apiUrl = `${environment.apiUrl}/categories`;
  private categoriesSubject = new BehaviorSubject<category[]>([]);
  categories$ = this.categoriesSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCategories(): Observable<category[]> {
    return this.http
      .get<{ data: { categories: category[] } }>(this.apiUrl)
      .pipe(
        tap((response) =>
          this.categoriesSubject.next(response.data.categories)
        ),
        catchError((error) => {
          console.error('Error fetching categories:', error);
          return of([]);
        }),
        map((response) => Array.isArray(response) ? [] : response.data.categories)
      );
  }
}
