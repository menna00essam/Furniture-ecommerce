// shop.component.ts
import { Component, HostListener } from '@angular/core';
import { FeatureBannerComponent } from '../feature-banner/feature-banner.component';
import { HeaderBannerComponent } from '../header-banner/header-banner.component';
import { CommonModule } from '@angular/common';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { FilterOptionComponent } from '../filter-option/filter-option.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    FeatureBannerComponent,
    HeaderBannerComponent,
    CommonModule,
    DropdownComponent,
    FilterOptionComponent,
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent {
  searchValue: string = 'Default';
  showFilters: boolean = true;
  
  menuItems: string[] = [
    'Default',
    'Price: Low to High',
    'Price: High to Low',
    'Rating',
    'Newest',
    'Discount',
  ];

  toggleShowFilter() {
    this.showFilters = !this.showFilters;
  }

  onSortChange(value: string) {
    this.searchValue = value;
  }
}
