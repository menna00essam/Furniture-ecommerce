import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { trigger, transition, animate, style } from '@angular/animations';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { product } from '../../../../Models/product.model';
import { FavoriteService } from '../../../../Services/favorite.service';
import { CartService } from '../../../../Services/cart.service';
import { AuthService } from '../../../../Services/auth.service';
import { productCart } from '../../../../Models/productCart.model';
import { productFavorite } from '../../../../Models/productFavorite.model';
import { user } from '../../../../Models/user.model';
import { UserService } from '../../../../Services/user.service';

@Component({
  selector: 'app-user-actions',
  imports: [CurrencyPipe, RouterModule, CommonModule],
  templateUrl: './user-actions.component.html',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate(
          '0.5s cubic-bezier(.4,0,.2,1)',
          style({ transform: 'translateX(0%)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '0.5s cubic-bezier(.4,0,.2,1)',
          style({ transform: 'translateX(100%)' })
        ),
      ]),
    ]),
  ],
})
export class UserActionsComponent implements OnInit {
  user$!: Observable<user | null>;
  cartProductsTotalPrice!: Observable<number>;
  cartLength$!: Observable<number>;
  cart$!: Observable<productCart[]>;
  favorites$!: Observable<productFavorite[]>;
  favoritesLength$!: Observable<number>;
  favModalShow = false;
  cartModalShow = false;
  isLoggedIn = false;

  constructor(
    private favoriteService: FavoriteService,
    private cartService: CartService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.user$ = this.userService.user$;
    this.userService.getUser().subscribe();
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });

    this.cart$ = this.cartService.cart$;
    this.cartLength$ = this.cartService.cart$.pipe(map((cart) => cart.length));
    this.cartProductsTotalPrice = this.cartService.getSubtotal();

    this.favorites$ = this.favoriteService.favorites$;
    this.favoritesLength$ = this.favoriteService.favorites$.pipe(
      map((favorites) => favorites.length)
    );
  }

  deleteFavorite(id: string): void {
    this.favoriteService.toggleFavourite(id).subscribe();
  }

  deleteCartProduct(id: string): void {
    this.cartService.removeProduct(id);
  }

  toggleFavModal(open: boolean): void {
    this.favModalShow = open;
    this.toggleBodyScroll(open);
  }

  toggleCartModal(open: boolean): void {
    this.cartModalShow = open;
    this.toggleBodyScroll(open);
  }

  private toggleBodyScroll(isOpen: boolean): void {
    document.body.style.overflowY = isOpen ? 'hidden' : 'auto';
    document.body.style.width = isOpen ? 'calc(100%)' : '';
  }
}
