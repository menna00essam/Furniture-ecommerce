import { Component } from '@angular/core';
import { FeatureBannerComponent } from '../feature-banner/feature-banner.component';
import { HeaderBannerComponent } from '../header-banner/header-banner.component';

@Component({
  selector: 'app-shop',
  imports: [FeatureBannerComponent, HeaderBannerComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent {}
