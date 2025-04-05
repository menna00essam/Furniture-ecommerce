import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  HostListener,
} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

import { ButtonComponent } from '../button/button.component';
import { RouterModule } from '@angular/router';

import {
  trigger,
  transition,
  animate,
  style,
  state,
} from '@angular/animations';

import { FavoriteService } from '../../../Services/favorite.service';
import { CartService } from '../../../Services/cart.service';
import { product } from '../../../Models/product.model';
import { Observable } from 'rxjs';

import { NgToastService } from 'ng-angular-popup';
import { productCart } from '../../../Models/productCart.model';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [CommonModule, ButtonComponent, RouterModule],
  providers: [CurrencyPipe],
  templateUrl: './product-item.component.html',
  animations: [
    trigger('slideInOut', [
      state('in', style({ transform: 'translateY(0%)', opacity: 1 })),
      state(
        'out',
        style({ transform: 'translateY(100%)', opacity: 0, display: 'none' })
      ),
      transition('in <=> out', [animate('300ms ease-in-out')]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductItemComponent implements OnInit {
  @Input({ required: true }) product!: product;

  isHovered = false;
  showActions = false;

  cart$!: Observable<productCart[]>;
  isInCartState = false;
  isFavoriteState = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private favoriteService: FavoriteService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.cart$ = this.cartService.cart$;

    // Initialize state
    this.isInCartState = this.cartService.isInCart(this.product.id);
    this.isFavoriteState = this.favoriteService.isInFavorites(this.product.id);
  }

  toggleFavourites() {
    this.favoriteService.toggleFavourite(this.product.id).subscribe({
      next: () => {
        this.isFavoriteState = this.favoriteService.isInFavorites(
          this.product.id
        );
        this.cdr.markForCheck();
      },
    });
  }

  toggleCart() {
    if (this.isInCartState) {
      this.cartService.removeProduct(this.product.id);
    } else {
      this.cartService.addProduct(this.product);
    }
    this.isInCartState = !this.isInCartState;
    this.cdr.markForCheck();
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    if (!this.showActions) {
      this.isHovered = true;
      this.cdr.markForCheck(); // Marks component for update without full re-render
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (!this.showActions) {
      this.isHovered = false;
      this.cdr.markForCheck();
    }
  }

  isNewProduct(): boolean {
    if (!this.product?.date) return false;
    const productDate = new Date(this.product.date).getTime();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return productDate > oneMonthAgo.getTime();
  }

  isFavorite(productId: string): boolean {
    return this.favoriteService.isInFavorites(productId);
  }

  isInCart(productId: string): boolean {
    return this.cartService.isInCart(productId);
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = '/images/products/1.png';
  }
}
