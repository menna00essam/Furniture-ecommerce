// shop.component.ts
import { Component, HostListener } from '@angular/core';
import { FeatureBannerComponent } from '../feature-banner/feature-banner.component';
import { HeaderBannerComponent } from '../header-banner/header-banner.component';
import { CommonModule } from '@angular/common';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { FilterOptionComponent } from '../filter-option/filter-option.component';
import { ProductItemComponent } from '../../shared/product-item/product-item.component';
import { product } from '../../models/product.model';
import { ButtonComponent } from '../../shared/button/button.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    FeatureBannerComponent,
    HeaderBannerComponent,
    CommonModule,
    DropdownComponent,
    FilterOptionComponent,
    ProductItemComponent,
    ButtonComponent,
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

  products: product[] = [
    {
      id: 1,
      img: '/images/product.png',
      title: 'Syltherine',
      discription: 'Stylish cafe chair',
      price: 2500000,
      sale: 20,
    },
    {
      id: 2,
      img: '/images/product.png',
      title: 'Syltherine',
      discription: 'Stylish cafe chair',
      price: 2500000,
    },
    {
      id: 3,
      img: '/images/product.png',
      title: 'Syltherine',
      discription: 'Stylish cafe chair',
      price: 2500000,
    },
    {
      id: 4,
      img: '/images/product.png',
      title: 'Syltherine',
      discription: 'Stylish cafe chair',
      price: 2500000,
      sale: 20,
    },
    {
      id: 5,
      img: '/images/product.png',
      title: 'Syltherine',
      discription: 'Stylish cafe chair',
      price: 2500000,
    },
    {
      id: 6,
      img: '/images/product.png',
      title: 'Syltherine',
      discription: 'Stylish cafe chair',
      price: 2500000,
    },
    {
      id: 7,
      img: '/images/product.png',
      title: 'Syltherine',
      discription: 'Stylish cafe chair',
      price: 2500000,
    },
    {
      id: 8,
      img: '/images/product.png',
      title: 'Syltherine',
      discription: 'Stylish cafe chair',
      price: 2500000,
    },
  ];

  toggleShowFilter() {
    this.showFilters = !this.showFilters;
  }

  onSortChange(value: string) {
    this.searchValue = value;
  }
}
