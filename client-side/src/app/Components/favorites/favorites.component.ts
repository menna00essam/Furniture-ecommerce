import { Component, OnInit } from '@angular/core';
import { HeaderBannerComponent } from '../shared/header-banner/header-banner.component';
import { FeatureBannerComponent } from '../shared/feature-banner/feature-banner.component';
import { FavoriteService } from '../../Services/favorite.service';
import { product } from '../../Models/product.model';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../shared/button/button.component';
import { RouterModule } from '@angular/router';

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
  constructor(private favoriteService: FavoriteService) {}
  ngOnInit(): void {
    this.favorites = this.favoriteService.getFavorites(1);
  }
  removeItem(id: number) {
    this.favoriteService.removeFavorite(1, id);
  }
}
