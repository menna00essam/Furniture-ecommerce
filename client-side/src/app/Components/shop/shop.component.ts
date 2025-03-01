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
import { FeatureBannerComponent } from '../feature-banner/feature-banner.component';
import { HeaderBannerComponent } from '../header-banner/header-banner.component';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { FilterOptionComponent } from '../filter-option/filter-option.component';
import { ProductItemComponent } from '../../shared/product-item/product-item.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { ProductService } from '../../Services/product.service';
import { product } from '../../models/product.model';
import { PaginationComponent } from '../pagination/pagination.component';

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
    ButtonComponent,
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

  // UI Controls
  showFilters: boolean = false;
  showSortMenu: boolean = false;
  disableAnimation: boolean = false;

  // Product Data
  products: product[] = [];
  filteredProducts: product[] = [];
  sortedProducts: product[] = [];

  // Filters & Sorting
  selectedSortValue: SortOptions = SortOptions.Default;
  selectedCategories: string[] = [];

  // Pagination
  productsPerPage: number = 5;
  currentPage: number = 1;

  sortMenuItems: SortOptions[] = Object.values(SortOptions);
  categories: string[] = [
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
    this.applyFiltersAndSorting();
    this.checkScreenSize();
  }

  get pagesCount(): number {
    return Math.ceil(this.sortedProducts.length / this.productsPerPage);
  }

  get displayedProducts(): product[] {
    const start = (this.currentPage - 1) * this.productsPerPage;
    return this.sortedProducts.slice(start, start + this.productsPerPage);
  }

  /** Handles sorting selection change */
  onSortChange(value: SortOptions) {
    if (this.selectedSortValue !== value) {
      this.selectedSortValue = value;
      this.applyFiltersAndSorting();
    }
    this.toggleDropdown(false);
  }

  /** Handles category filter selection */
  onCategoryChange(category: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedCategories = checked
      ? [...this.selectedCategories, category]
      : this.selectedCategories.filter((c) => c !== category);

    this.applyFiltersAndSorting();
  }

  /** Filters and sorts products based on selected criteria */
  applyFiltersAndSorting() {
    this.filteredProducts = this.selectedCategories.length
      ? this.products.filter((p) =>
          this.selectedCategories.includes(p.category)
        )
      : [...this.products];

    this.sortedProducts = this.getSortedProducts([...this.filteredProducts]);
    this.goToPage(1);
  }

  /** Returns a sorted array based on the selected sorting option */
  private getSortedProducts(products: product[]): product[] {
    switch (this.selectedSortValue) {
      case SortOptions.LowToHigh:
        return products.sort(
          (a, b) => this.getEffectivePrice(a) - this.getEffectivePrice(b)
        );
      case SortOptions.HighToLow:
        return products.sort(
          (a, b) => this.getEffectivePrice(b) - this.getEffectivePrice(a)
        );
      case SortOptions.Newest:
        return products.sort(
          (a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0)
        );
      case SortOptions.Discount:
        return products
          .filter((p) => typeof p.sale === 'number')
          .sort((a, b) => (b.sale || 0) - (a.sale || 0));
      default:
        return products;
    }
  }

  /** Returns the effective price of a product after discount */
  private getEffectivePrice(product: product): number {
    return product.sale
      ? product.price * (1 - product.sale / 100)
      : product.price;
  }

  /** Handles pagination */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.pagesCount) {
      this.currentPage = page;
      this.scrollToProducts();
    }
  }

  /** Smooth scroll to the products container */
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

  /** Toggles filter panel */
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
