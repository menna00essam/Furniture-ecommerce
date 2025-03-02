import { Injectable } from '@angular/core';
import { product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: product[] = [];

  getCart(userId: number): product[] {
    return [...this.cart];
  }

  addProduct(userId: number, product: product): void {
    if (this.cart.every((p) => p.id != product.id)) this.cart.push(product);
  }

  removeProduct(userId: number, productId: number): void {
    this.cart = this.cart.filter((p) => p.id !== productId);
  }

  //To be done
  increaseQuantity(userId: number, productId: number) {}
  deccreaseQuantity(userId: number, productId: number) {}
}
