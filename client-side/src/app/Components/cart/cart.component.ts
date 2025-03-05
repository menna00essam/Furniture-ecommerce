import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartTotalsComponent } from './cart-components/cart-totals/cart-totals.component';
import { FeatureBannerComponent } from '../shared/feature-banner/feature-banner.component';
import { HeaderBannerComponent } from '../shared/header-banner/header-banner.component';
import { CartService } from '../../Services/cart.service';
import { product } from '../../models/product.model';

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
    CurrencyPipe,
  ],
})
export class CartComponent implements OnInit {
  cart: product[] = [];
  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cart = this.cartService.getCart(1);
  }

  get subtotal(): number {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  updateQuantity(item: product, quantity: number) {
    item.quantity = quantity;
  }

  removeItem(itemId: number) {
    this.cartService.removeProduct(1, itemId);
    this.cart = this.cartService.getCart(1);
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
