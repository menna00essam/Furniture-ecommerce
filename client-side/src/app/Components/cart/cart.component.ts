import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartTotalsComponent } from './cart-components/cart-totals/cart-totals.component';
import { FeatureBannerComponent } from '../feature-banner/feature-banner.component';
import { HeaderBannerComponent } from '../header-banner/header-banner.component';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CartTotalsComponent,
    HeaderBannerComponent,
    FeatureBannerComponent,
  ],
})
export class CartComponent {
  cart: CartItem[] = [
    {
      id: 1,
      name: 'Asgaard sofa',
      price: 250000,
      quantity: 1,
      image: 'images/mainsofa.png',
    },
    {
      id: 2,
      name: 'Asgaard sofa',
      price: 250000,
      quantity: 1,
      image: 'images/mainsofa.png',
    },
  ];

  get subtotal(): number {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  updateQuantity(item: CartItem, quantity: number) {
    item.quantity = quantity;
  }

  removeItem(itemId: number) {
    this.cart = this.cart.filter((item) => item.id !== itemId);
  }

  increaseQuantity(item: any) {
    item.quantity++;
  }

  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
    }
  }
}
