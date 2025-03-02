import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { trigger, transition, animate, style } from '@angular/animations';
import { FeatureBannerComponent } from '../shared/feature-banner/feature-banner.component';
import { HeaderBannerComponent } from '../shared/header-banner/header-banner.component';
import { DropdownComponent } from '../shared/dropdown/dropdown.component';
import { FilterOptionComponent } from './filter-option/filter-option.component';

import { ProductService } from '../../Services/product.service';
import { product } from '../../Models/product.model';
import { ProductItemComponent } from '../shared/product-item/product-item.component';
import { PaginationComponent } from '../shared/pagination/pagination.component';

enum SortOptions {
  Default = 'Default',
  LowToHigh = 'Price: Low to High',
  HighToLow = 'Price: High to Low',
  Newest = 'Newest',
  Discount = 'Discount',
}

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
    PaginationComponent,
    TitleCasePipe,
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

  // UI State
  showFilters = false;
  showSortMenu = false;
  disableAnimation = false;

  // Product Data
  products: product[] = [];
  selectedSortValue: SortOptions = SortOptions.Default;
  selectedCategories: string[] = [];

  // Pagination
  productsPerPage = 5;
  currentPage = 1;

  sortMenuItems = Object.values(SortOptions);
  categories = [
    'chair',
    'sofa',
    'stool',
    'desk',
    'bed',
    'bench',
    'table',
    'shelf',
  ];

  constructor(
    private productService: ProductService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.products = this.productService.getProducts();
    this.checkScreenSize();
  }

  /** Returns the total number of pages */
  get pagesCount(): number {
    return Math.ceil(this.filteredProducts.length / this.productsPerPage);
  }

  /** Returns products after filtering and sorting */
  get filteredProducts(): product[] {
    let filtered = this.selectedCategories.length
      ? this.products.filter((p) =>
          this.selectedCategories.includes(p.category)
        )
      : [...this.products];

    return this.getSortedProducts(filtered);
  }

  /** Returns the paginated products */
  get displayedProducts(): product[] {
    const start = (this.currentPage - 1) * this.productsPerPage;
    return this.filteredProducts.slice(start, start + this.productsPerPage);
  }

  /** Handles sorting selection */
  onSortChange(value: any) {
    const sortOption = value as SortOptions;
    if (this.sortMenuItems.includes(sortOption)) {
      this.selectedSortValue = sortOption;
    }
    this.toggleDropdown(false);
  }

  /** Handles category selection */
  onCategoryChange(category: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedCategories = checked
      ? [...this.selectedCategories, category]
      : this.selectedCategories.filter((c) => c !== category);
  }

  /** Returns a sorted product list */
  private getSortedProducts(products: product[]): product[] {
    return products.sort((a, b) => {
      switch (this.selectedSortValue) {
        case SortOptions.LowToHigh:
          return this.getEffectivePrice(a) - this.getEffectivePrice(b);
        case SortOptions.HighToLow:
          return this.getEffectivePrice(b) - this.getEffectivePrice(a);
        case SortOptions.Newest:
          return (b.date?.getTime() || 0) - (a.date?.getTime() || 0);
        case SortOptions.Discount:
          return (b.sale || 0) - (a.sale || 0);
        default:
          return 0;
      }
    });
  }

  /** Calculates the effective price of a product */
  private getEffectivePrice(product: product): number {
    return product.sale
      ? product.price * (1 - product.sale / 100)
      : product.price;
  }

  /** Returns the range of displayed results */
  getDisplayedResultsRange(): string {
    if (!this.displayedProducts.length) return 'No results found';
    const start = (this.currentPage - 1) * this.productsPerPage + 1;
    const end = Math.min(
      this.currentPage * this.productsPerPage,
      this.filteredProducts.length
    );
    return `Showing ${start}-${end} of ${this.filteredProducts.length} results`;
  }

  /** Handles pagination */
  goToPage(page: number) {
    if (page >= 1 && page <= this.pagesCount) {
      this.currentPage = page;
      this.scrollToProducts();
    }
  }

  /** Smooth scroll to product list */
  private scrollToProducts() {
    if (this.productsContainer) {
      const offset = 100;
      const topPosition =
        this.productsContainer.nativeElement.getBoundingClientRect().top +
        window.scrollY -
        offset;

      window.scrollTo({ top: topPosition, behavior: 'smooth' });
    }
  }

  /** Toggles the filter panel */
  toggleShowFilter(open: boolean = !this.showFilters) {
    this.showFilters = open;
    if (window.innerWidth < 1024) {
      this.renderer.setStyle(document.body, 'overflowY', open ? 'hidden' : '');
    }
  }

  /** Toggles sorting dropdown */
  toggleDropdown(open: boolean) {
    this.showSortMenu = open;
  }

  /** Handles screen resizing */
  @HostListener('window:resize')
  checkScreenSize() {
    this.disableAnimation = window.innerWidth >= 1024;
  }
}
