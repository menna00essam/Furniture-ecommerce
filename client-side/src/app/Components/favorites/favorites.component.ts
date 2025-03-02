import { Component } from '@angular/core';
import { HeaderBannerComponent } from '../shared/header-banner/header-banner.component';
import { FeatureBannerComponent } from '../shared/feature-banner/feature-banner.component';

@Component({
  selector: 'app-favorites',
  imports: [HeaderBannerComponent, FeatureBannerComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css',
})
export class FavoritesComponent {}
