import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
  ViewChild,
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
import { PaginationComponent } from '../pagination/pagination.component';

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
    PaginationComponent,
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
  @ViewChild('productsContainer') productsContainer!: ElementRef;
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
  productsPerPage: number = 5;
  pagesCount: number = 0;
  currentPage: number = 1;

  constructor(
    private productService: ProductService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.products = this.productService.getProducts();
    this.pagesCount = Math.ceil(this.products.length / this.productsPerPage);
    this.goToPage(1);
    this.checkScreenSize();
  }

  get displayedProducts(): product[] {
    const start = (this.currentPage - 1) * this.productsPerPage;
    const end = start + this.productsPerPage;
    return this.products.slice(start, end);
  }

  goToPage(page: number): void {
    this.currentPage = page;

    if (this.productsContainer) {
      const offset = 100;
      const topPosition =
        this.productsContainer.nativeElement.getBoundingClientRect().top +
        window.scrollY -
        offset;

      window.scrollTo({
        top: topPosition,
        behavior: 'smooth',
      });
    }
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
