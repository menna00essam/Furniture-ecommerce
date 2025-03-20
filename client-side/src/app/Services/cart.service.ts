import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { product } from '../Models/product.model';
import { AuthService } from './auth.service';
import { productCart } from '../Models/productCart.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = 'http://localhost:5000/cart';

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private cartSubject = new BehaviorSubject<productCart[]>([]);
  cart$ = this.cartSubject.asObservable();

  private checkoutSubject = new BehaviorSubject<productCart[]>([]);
  checkoutData$ = this.checkoutSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedInSubject.next(status);
      this.loadCart();
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  private getGuestCart(): productCart[] {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  }

  private saveGuestCart(cart: productCart[]): void {
    cart.length === 0
      ? localStorage.removeItem('cart')
      : localStorage.setItem('cart', JSON.stringify(cart));
  }

  private loadCart(): void {
    this.getCart().subscribe((cart) => this.cartSubject.next(cart));
  }

  getCart(): Observable<productCart[]> {
    if (this.isLoggedInSubject.getValue()) {
      return this.http
        .get<{ data: { products: any[] } }>(this.apiUrl, {
          headers: this.getAuthHeaders(),
        })
        .pipe(
          map(({ data }) =>
            data.products.map((p) => {
              const effectivePrice = p.productSale
                ? p.productPrice * (1 - p.productSale / 100)
                : p.productPrice;
              return {
                id: p._id,
                name: p.productName,
                images: p.productImages,
                price: effectivePrice,
                quantity: p.productQuantity,
                subtotal: effectivePrice * p.productQuantity,
              };
            })
          ),
          tap((cart) => this.cartSubject.next(cart)),
          catchError(() => {
            this.cartSubject.next([]);
            return of([]);
          })
        );
    } else {
      const guestCart = this.getGuestCart();
      this.cartSubject.next(guestCart);
      return of(guestCart);
    }
  }

  updateCart(cart: productCart[]): void {
    this.cartSubject.next(cart);
    if (!this.isLoggedInSubject.getValue()) this.saveGuestCart(cart);
    console.log(cart);
  }

  addProduct(product: product): void {
    const discountedPrice = product.sale
      ? product.price * (1 - product.sale / 100)
      : product.price;
    const cart = [...this.cartSubject.getValue()];
    const existingProduct = cart.find((p) => p.id === product.id);

    if (existingProduct) {
      existingProduct.quantity++;
      existingProduct.subtotal =
        existingProduct.quantity * existingProduct.price;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        images: product.images,
        price: discountedPrice,
        quantity: 1,
        subtotal: discountedPrice,
      });
    }

    this.updateCart(cart);
    if (this.isLoggedInSubject.getValue()) {
      this.http
        .post(this.apiUrl, [{ productId: product.id, quantity: 1 }], {
          headers: this.getAuthHeaders(),
        })
        .subscribe();
    }
  }

  removeProduct(productId: string): void {
    this.modifyQuantity(productId, 0, true);
  }

  private modifyQuantity(
    productId: string,
    change: number,
    remove = false
  ): void {
    let cart = [...this.cartSubject.getValue()];
    if (remove) {
      cart = cart.filter((p) => p.id !== productId);
    } else {
      const product = cart.find((p) => p.id === productId);
      if (product) {
        product.quantity += change;
        product.subtotal = product.quantity * product.price;
        if (product.quantity <= 0) {
          cart = cart.filter((p) => p.id !== productId);
        }
      }
    }
    this.updateCart(cart);
    if (this.isLoggedInSubject.getValue()) {
      this.http
        .patch(
          this.apiUrl,
          {
            productId,
            quantity: remove
              ? 0
              : cart.find((p) => p.id === productId)?.quantity || 0,
          },
          { headers: this.getAuthHeaders() }
        )
        .subscribe();
    }
  }

  increaseQuantity(productId: string): void {
    this.modifyQuantity(productId, 1);
  }

  decreaseQuantity(productId: string): void {
    this.modifyQuantity(productId, -1);
  }

  getSubtotal(): Observable<number> {
    return this.cart$.pipe(
      map((cart) => cart.reduce((sum, item) => sum + item.subtotal, 0))
    );
  }

  setCheckoutData(): void {
    this.checkoutSubject.next([...this.cartSubject.getValue()]);
  }

  getCheckoutData(): productCart[] {
    return this.checkoutSubject.getValue();
  }

  isInCart(productId: string): boolean {
    return this.cartSubject.getValue().some((p) => p.id === productId);
  }

  clearCart(): void {
    this.cartSubject.next([]);
    this.checkoutSubject.next([]);
    localStorage.removeItem('cart');
  }
}
