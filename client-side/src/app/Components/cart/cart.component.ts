import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartTotalsComponent } from './cart-components/cart-totals/cart-totals.component';
import { FeatureBannerComponent } from '../shared/feature-banner/feature-banner.component';
import { HeaderBannerComponent } from '../shared/header-banner/header-banner.component';
import { CartService } from '../../Services/cart.service';
import { Observable, map } from 'rxjs';
import { StepperComponent } from '../shared/stepper/stepper.component';
import { productCart } from '../../Models/productCart.model';
import { ButtonComponent } from '../shared/button/button.component';
import { Router } from '@angular/router';

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
    StepperComponent,
  ],
})
export class CartComponent implements OnInit {
  cart$!: Observable<productCart[]>;
  cartLength$!: Observable<number>;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.cart$ = this.cartService.cart$;
    this.cartLength$ = this.cart$.pipe(map((cart) => cart.length));
  }

  removeItem(itemId: string) {
    this.cartService.removeProduct(itemId);
  }

  increaseQuantity(productId: string) {
    this.cartService.increaseQuantity(productId);
  }

  decreaseQuantity(productId: string) {
    this.cartService.decreaseQuantity(productId);
  }

  goToCheckout() {
    this.router.navigate(['/checkout']);
  }
}
