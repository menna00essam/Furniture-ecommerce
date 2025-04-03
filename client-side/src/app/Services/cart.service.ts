import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { product } from '../Models/product.model';
import { AuthService } from './auth.service';
import { productCart } from '../Models/productCart.model';
import { NgToastService } from 'ng-angular-popup';

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = 'http://localhost:5000/cart';

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  private cartSubject = new BehaviorSubject<productCart[]>([]);
  cart$ = this.cartSubject.asObservable();

  private cartSubtotalSubject = new BehaviorSubject<number>(0);
  cartSubtotal$ = this.cartSubtotalSubject.asObservable();

  private checkoutSubject = new BehaviorSubject<productCart[]>([]);
  checkoutData$ = this.checkoutSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private toast: NgToastService
  ) {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedInSubject.next(status);
      this.loadCart();
    });
  }

  /*** Helper Methods ***/

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

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      if (error.status !== 404) console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }

  /*** Cart Operations ***/

  private loadCart(): void {
    this.getCart().subscribe();
  }

  getCart(): Observable<productCart[]> {
    if (this.isLoggedInSubject.getValue()) {
      return this.http
        .get<{ data: { products: any[]; totalPrice: number } }>(this.apiUrl, {
          headers: this.getAuthHeaders(),
        })
        .pipe(
          map(({ data }) => {
            this.cartSubtotalSubject.next(data.totalPrice);
            return data.products.map((p) => this.mapToProductCart(p));
          }),
          tap((cart) => {
            this.cartSubject.next(cart);
          }),
          catchError(this.handleError<productCart[]>('getCart', []))
        );
    } else {
      const guestCart = this.getGuestCart();
      this.cartSubject.next(guestCart);
      this.cartSubtotalSubject.next(
        guestCart.reduce((sum, p) => sum + p.subtotal, 0)
      );
      return of(guestCart);
    }
  }

  private mapToProductCart(p: any): productCart {
    return {
      id: p._id,
      name: p.productName,
      image: p.productImage,
      price: p.productPrice,
      quantity: p.productQuantity,
      subtotal: p.productSubtotal,
    };
  }

  updateCart(cart: productCart[]): void {
    this.cartSubject.next(cart);
    if (!this.isLoggedInSubject.getValue()) this.saveGuestCart(cart);
  }

  addProduct(product: product): void {
    if (this.isLoggedInSubject.getValue()) {
      this.getCart()
        .pipe(
          switchMap(() =>
            this.http.post(
              this.apiUrl,
              [{ productId: product.id, quantity: 1, color: product.color }],
              { headers: this.getAuthHeaders() }
            )
          ),
          catchError(this.handleError('addProduct'))
        )
        .subscribe({
          next: (response: any) => {
            if (response.status === 'success') {
              let cart = [...this.cartSubject.getValue()];
              const discountedPrice = product.sale
                ? product.price * (1 - product.sale / 100)
                : product.price;

              let existingProduct = cart.find((p) => p.id === product.id);

              if (existingProduct) {
                existingProduct.quantity++;
                existingProduct.subtotal =
                  existingProduct.quantity * existingProduct.price;
              } else {
                cart.push({
                  id: product.id,
                  name: product.name,
                  image: product.image,
                  price: discountedPrice,
                  quantity: 1,
                  subtotal: discountedPrice,
                });
              }

              this.cartSubject.next(cart);
              this.cartSubtotalSubject.next(
                cart.reduce((sum, p) => sum + p.subtotal, 0)
              );
              this.toast.success(`${product.name} added to cart successfully.`);
            }
          },
        });
    } else {
      let cart = [...this.cartSubject.getValue()];
      const discountedPrice = product.sale
        ? product.price * (1 - product.sale / 100)
        : product.price;

      cart.push({
        id: product.id,
        name: product.name,
        image: product.image,
        price: discountedPrice,
        quantity: 1,
        subtotal: discountedPrice,
      });

      this.saveGuestCart(cart);
      this.cartSubject.next(cart);
      this.cartSubtotalSubject.next(
        cart.reduce((sum, p) => sum + p.subtotal, 0)
      );
      this.toast.success(`${product.name} added to cart successfully.`);
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
    let productName = '';

    const product = cart.find((p) => p.id === productId);
    if (product) {
      productName = product.name;
      if (remove) {
        cart = cart.filter((p) => p.id !== productId);
      } else {
        product.quantity += change;
        product.subtotal = product.quantity * product.price;
        if (product.quantity <= 0) {
          cart = cart.filter((p) => p.id !== productId);
        }
      }
    }

    if (this.isLoggedInSubject.getValue()) {
      // Logged-in users: Send API request
      this.http
        .patch(
          this.apiUrl,
          { productId, quantity: remove ? 0 : product?.quantity || 0 },
          { headers: this.getAuthHeaders() }
        )
        .pipe(
          catchError((error) => {
            this.toast.danger(
              remove
                ? `Failed to remove ${productName} from cart.`
                : `Failed to update ${productName} quantity.`
            );
            return this.handleError('modifyQuantity')(error);
          })
        )
        .subscribe({
          next: (response: any) => {
            if (response.status === 'success') {
              this.cartSubject.next(cart);
              this.cartSubtotalSubject.next(
                cart.reduce((sum, p) => sum + p.subtotal, 0)
              );

              const message = remove
                ? `${productName} has been removed from the cart.`
                : `${productName} quantity updated successfully.`;
              this.toast.success(message);
            }
          },
        });
    } else {
      this.saveGuestCart(cart);
      this.cartSubject.next(cart);
      this.cartSubtotalSubject.next(
        cart.reduce((sum, p) => sum + p.subtotal, 0)
      );
      const message = remove
        ? `${productName} has been removed from the cart.`
        : `${productName} quantity updated successfully.`;
      this.toast.success(message);
    }
  }

  increaseQuantity(productId: string): void {
    this.modifyQuantity(productId, 1);
  }

  decreaseQuantity(productId: string): void {
    this.modifyQuantity(productId, -1);
  }

  /*** Checkout Operations ***/

  setCheckoutData(): void {
    this.checkoutSubject.next([...this.cartSubject.getValue()]);
  }

  getCheckoutData(): productCart[] {
    return this.checkoutSubject.getValue();
  }

  /*** Utility Methods ***/

  isInCart(productId: string): boolean {
    return this.cartSubject.getValue().some((p) => p.id === productId);
  }

  clearCart(): void {
    this.cartSubject.next([]);
    this.checkoutSubject.next([]);
    localStorage.removeItem('cart');
  }
}
