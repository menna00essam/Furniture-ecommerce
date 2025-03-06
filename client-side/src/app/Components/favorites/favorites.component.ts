import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HeaderBannerComponent } from '../shared/header-banner/header-banner.component';
import { FeatureBannerComponent } from '../shared/feature-banner/feature-banner.component';
import { FavoriteService } from '../../Services/favorite.service';
import { product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../shared/button/button.component';
import { RouterModule } from '@angular/router';
import { CartService } from '../../Services/cart.service';

@Component({
  selector: 'app-favorites',
  imports: [
    HeaderBannerComponent,
    FeatureBannerComponent,
    ButtonComponent,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css',
})
export class FavoritesComponent implements OnInit {
  favorites: product[] = [];
  constructor(
    private cdr: ChangeDetectorRef,
    private favoriteService: FavoriteService,
    private cartService: CartService
  ) {}
  ngOnInit(): void {
    this.favorites = this.favoriteService.getFavorites(1);
  }
  removeItem(id: number) {
    this.favoriteService.removeFavorite(1, id);
  }

  addToCart(product: product) {
    if (this.isInCart(product.id)) {
      this.cartService.removeProduct(1, product.id);
    } else {
      this.cartService.addProduct(1, product);
    }
    this.cdr.detectChanges(); // Force UI update
  }

  isInCart(productID: number): boolean {
    return this.cartService.getCart(1).some((p) => p.id === productID);
  }
}
