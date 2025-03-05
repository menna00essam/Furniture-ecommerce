import {
  Component,
  Input,
  ChangeDetectionStrategy,
  HostListener,
  OnInit,
  ChangeDetectorRef,
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
import { product } from '../../../models/product.model';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [CommonModule, ButtonComponent, RouterModule],
  providers: [CurrencyPipe],
  templateUrl: './product-item.component.html',
  animations: [
    trigger('slideInOut', [
      state('in', style({ transform: 'translateY(0%)', opacity: 1 })),
      state('out', style({ transform: 'translateY(100%)', opacity: 0 })),
      transition('in <=> out', [animate('300ms ease-in-out')]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductItemComponent implements OnInit {
  @Input({ required: true }) product!: product;

  isHovered = false;
  disableAnimation = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private favoriteService: FavoriteService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.checkScreenSize();
  }

  onMouseEnter() {
    if (!this.disableAnimation) this.isHovered = true;
  }

  onMouseLeave() {
    if (!this.disableAnimation) this.isHovered = false;
  }

  @HostListener('window:resize')
  checkScreenSize() {
    const isSmallScreen = window.innerWidth < 1024;
    if (this.disableAnimation !== isSmallScreen) {
      this.disableAnimation = isSmallScreen;
      this.isHovered = isSmallScreen;
      this.cdr.detectChanges(); // Force UI update
    }
  }

  addToFavourites() {
    this.favoriteService.addFavorite(1, this.product);
  }

  addToCart() {
    this.cartService.addProduct(1, this.product);
  }

  isNewProduct(): boolean {
    if (!this.product?.date) return false;
    const productDate = new Date(this.product.date).getTime();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return productDate > oneMonthAgo.getTime();
  }
}
