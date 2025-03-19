import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { product } from '../Models/product.model';
import { AuthService } from './auth.service';
import { productCart } from '../Models/productCart.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://localhost:5000/cart';

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private cartSubject = new BehaviorSubject<productCart[]>([]);
  cart$ = this.cartSubject.asObservable();

  private checkoutSubject = new BehaviorSubject<productCart[]>([]);
  checkoutData$ = this.checkoutSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    // Subscribe to AuthService's isLoggedIn$ to update CartService
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedInSubject.next(status);
      this.loadCart(); // Load cart when login status changes
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  private getGuestCart(): productCart[] {
    const guestCart = JSON.parse(localStorage.getItem('cart') || '[]');

    return guestCart.map((p: any) => ({
      id: p.id,
      name: p.name,
      images: p.images?.length ? p.images : ['/images/products/1.jpg'],
      subTitle: p.subTitle,
      price: p.price,
      quantity: p.quantity,
    }));
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
          tap((res) => {
            console.log(res);
          }),
          map(({ data }) =>
            data.products.map((p) => ({
              id: p._id,
              name: p.productName,
              images: p.productImages,
              price: p.productPrice,
              quantity: p.productQuantity,
            }))
          ),
          catchError((error) => {
            console.error('Error fetching products:', error);
            return of([]);
          })
        );
    } else {
      const guestCart = this.getGuestCart();
      if (
        JSON.stringify(this.cartSubject.getValue()) !==
        JSON.stringify(guestCart)
      ) {
        this.cartSubject.next(guestCart);
      }
      return of(guestCart);
    }
  }

  updateCart(cart: productCart[]): void {
    this.cartSubject.next(cart);
    console.log(cart);
  }

  addProduct(product: productCart): void {
    this.cart$.subscribe((cart) => {
      const updatedCart = [...cart];

      if (!updatedCart.some((p) => p.id === product.id)) {
        updatedCart.push({ ...product, quantity: 1 });
        this.updateCart(updatedCart);

        if (this.isLoggedInSubject.getValue()) {
          console.log(1);
          this.http
            .post(this.apiUrl, [{ productId: product.id, quantity: 1 }], {
              headers: this.getAuthHeaders(),
            })
            .subscribe();
        } else {
          this.saveGuestCart(updatedCart);
        }
      }
    });
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
      cart = cart.filter((p) => p.id !== productId); // Remove the product
    } else {
      const product = cart.find((p) => p.id === productId);
      if (product) {
        product.quantity += change;
        if (product.quantity <= 0) {
          cart = cart.filter((p) => p.id !== productId); // Remove if quantity is zero
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
    } else {
      this.saveGuestCart(cart);
    }
  }

  increaseQuantity(productId: string): void {
    this.modifyQuantity(productId, 1);
  }

  decreaseQuantity(productId: string): void {
    this.modifyQuantity(productId, -1);
  }

  getSubtotal(): Observable<number> {
    return this.cartSubject
      .asObservable()
      .pipe(
        map((cart) =>
          cart && cart.length > 0
            ? cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
            : 0
        )
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
