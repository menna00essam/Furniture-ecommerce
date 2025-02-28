import { Component } from '@angular/core';
import { product } from '../../models/product.model';
import { CurrencyPipe } from '@angular/common';
import { trigger, transition, animate, style } from '@angular/animations';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-actions',
  imports: [CurrencyPipe, RouterModule],
  templateUrl: './user-actions.component.html',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('200ms ease-in', style({ transform: 'translateX(0%)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(100%)' })),
      ]),
    ]),
  ],
})
export class UserActionsComponent {
  cartProductsTotalPrice = 0;
  favModalShow = false;
  cartModalShow = false;

  favorites: product[] = [
    {
      id: 1,
      img: '/images/product.png',
      title: 'Syltherine',
      description: 'Stylish cafe chair',
      price: 2500000,
      sale: 20,
    },
  ];

  cart: product[] = [
    {
      id: 1,
      img: '/images/product.png',
      title: 'Syltherine',
      description: 'Stylish cafe chair',
      price: 2500000,
      sale: 20,
    },
  ];

  constructor() {
    this.cartProductsTotalPrice = this.cart.reduce(
      (total, i) => total + i.price,
      0
    );
  }
  deletefavorites(id: number) {
    this.favorites = this.favorites.filter((fav) => fav.id !== id);
  }

  deleteCartProduct(id: number) {
    this.cart = this.cart.filter((item) => item.id !== id);
    this.cartProductsTotalPrice = this.cart.reduce(
      (total, item) => total + item.price,
      0
    );
  }

  toggleFavModal(open: boolean) {
    this.favModalShow = open;
    if (open) {
      document.body.style.overflowY = 'hidden';
      document.body.style.width = 'calc(100% - 10px)';
    } else {
      document.body.style.overflowY = 'auto';
      document.body.style.width = '';
    }
  }

  toggleCartModal(open: boolean) {
    this.cartModalShow = open;
    if (open) {
      document.body.style.overflowY = 'hidden';
      document.body.style.width = 'calc(100% - 10px)';
    } else {
      document.body.style.overflowY = 'auto';
      document.body.style.width = '';
    }
  }
}
