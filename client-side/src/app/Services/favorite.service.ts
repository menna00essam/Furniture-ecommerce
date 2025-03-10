import { Injectable } from '@angular/core';
import { product } from '../Models/product.model';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private favorites: product[] = [];

  getFavorites(id: string): product[] {
    return this.favorites;
  }

  addFavorite(id: string, product: product) {
    if (this.favorites.every((p) => p.id != product.id))
      this.favorites.push(product);
  }

  removeFavorite(userId: string, productId: string): void {
    this.favorites = this.favorites.filter((p) => p.id !== productId);
  }
}
