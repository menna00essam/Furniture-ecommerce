import {
  Component,
  HostListener,
  OnInit,
  Renderer2,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, animate, style } from '@angular/animations';
import { FeatureBannerComponent } from '../feature-banner/feature-banner.component';
import { HeaderBannerComponent } from '../header-banner/header-banner.component';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { FilterOptionComponent } from '../filter-option/filter-option.component';
import { ProductItemComponent } from '../../shared/product-item/product-item.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { ProductService } from '../../Services/product.service';
import { product } from '../../models/product.model';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    CommonModule,
    FeatureBannerComponent,
    HeaderBannerComponent,
    DropdownComponent,
    FilterOptionComponent,
    ProductItemComponent,
    ButtonComponent,
  ],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('200ms ease-in', style({ transform: 'translateX(0%)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(-100%)' })),
      ]),
    ]),
  ],
})
export class ShopComponent implements OnInit {
  searchValue: string = 'Default';
  showFilters: boolean = false;
  isMenuOpen: boolean = false;
  disableAnimation: boolean = false;

  menuItems: string[] = [
    'Default',
    'Price: Low to High',
    'Price: High to Low',
    'Rating',
    'Newest',
    'Discount',
  ];

  products: product[] = [];

  constructor(
    private productService: ProductService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnInit() {
    this.products = this.productService.getProducts();
    this.checkScreenSize();
  }

  toggleShowFilter(open: boolean = !this.showFilters) {
    this.showFilters = open;
    if (window.innerWidth < 1024) {
      if (open) {
        this.renderer.setStyle(document.body, 'overflowY', 'hidden');
        this.renderer.setStyle(document.body, 'width', 'calc(100% - 10px)');
      } else {
        this.renderer.removeStyle(document.body, 'overflowY');
        this.renderer.removeStyle(document.body, 'width');
      }
    }
  }

  toggleDropdown(open: boolean) {
    this.isMenuOpen = open;
  }

  onSortChange(value: string) {
    this.searchValue = value;
    this.toggleDropdown(false);
  }

  @HostListener('window:resize')
  checkScreenSize() {
    this.disableAnimation = window.innerWidth >= 1024;
  }
}
