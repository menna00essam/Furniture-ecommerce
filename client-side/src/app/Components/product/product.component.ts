import { AsyncPipe, CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { ProductService } from '../../Services/product.service';
import { ThumbnailComponent } from '../products-components/thumbnail/thumbnail.component';
import { ProductDescriptionComponent } from '../products-components/product-description/product-description.component';
import { ButtonComponent } from '../shared/button/button.component';
import { ProductDetails } from '../../Models/product-details.model';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductItemComponent } from '../shared/product-item/product-item.component';
import { FavoriteService } from '../../Services/favorite.service';
import { CartService } from '../../Services/cart.service';
import { Observable, BehaviorSubject, map, Subscription } from 'rxjs';
import { product } from '../../Models/product.model';
import { ProductSkeletonComponent } from './product-skeleton/product-skeleton.component';
import { ProductItemSkeletonComponent } from '../shared/product-item/product-item-skeleton/product-item-skeleton.component';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    ThumbnailComponent,
    RouterModule,
    AsyncPipe,
    ProductDescriptionComponent,
    ProductItemComponent,
    ProductSkeletonComponent,
    ProductItemSkeletonComponent,
  ],
  templateUrl: './product.component.html',
})
export class ProductComponent implements OnInit {
  productId: string | null = null;
  private productSubject = new BehaviorSubject<ProductDetails | null>(null);
  product$ = this.productSubject.asObservable(); // Observable for the product
  relatedProducts$!: Observable<product[]>;
  warningMessage: string | null = null;
  colors: {
    name: string;
    hex: string;
    mainImage?: string | null;
    galleryImages?: string[];
    quantity?: number;
    sku?: string;
  }[] = [];
  selectedColorIndex: number = 0;
  selectedImage!: string;
  selectedColor: {
    name: string;
    hex: string;
    mainImage?: string | null;
    galleryImages?: string[];
    quantity?: number;
    sku?: string;
  } | null = null;
  count: number = 1;
  originalPrice: number = 0;
  salePrice: number = 0;
  isInCartState: boolean = false;
  isFavoriteState: boolean = false;

  private routeSub: Subscription = new Subscription();

  constructor(
    private cdr: ChangeDetectorRef,
    private productService: ProductService,
    private favoriteService: FavoriteService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.routeSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.loadProduct();
      }
    });
    this.loadProduct();
  }

  loadProduct(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.fetchProduct(this.productId);
      this.relatedProducts$ = this.productService.products$;
      this.productService.getProducts(1, 5).subscribe();
    } else {
      console.error('Product ID not found in route parameters.');
    }
  }

  toggleFavorite() {
    this.product$.subscribe((product) => {
      if (product) {
        this.favoriteService.toggleFavourite(product.id).subscribe(() => {
          this.isFavoriteState = this.favoriteService.isInFavorites(product.id);
          this.cdr.markForCheck();
        });
      }
    });
  }

  getMappedProduct$(): Observable<product | null> {
    return this.product$.pipe(
      map((product) => {
        if (!product || !this.selectedColor) return null;

        return {
          id: product.id,
          name: product.productName,
          image: this.selectedColor.mainImage || 'default-image.jpg',
          subTitle: product.productSubtitle,
          price: this.salePrice,
          color: this.selectedColor.name,
          quantity: this.count,
          categories: product.productCategories || [],
          date: product.productDate,
          sale: product.productSale,
          colors: [this.selectedColor.hex],
          sizes: [],
          brand: product.brand,
        };
      })
    );
  }

  toggleCart() {
    this.getMappedProduct$().subscribe((productToAdd) => {
      if (!productToAdd) {
        this.warningMessage = 'Please select a color first';
        return;
      }

      const variantId = String(productToAdd.id);

      if (this.isInCartState) {
        this.cartService.removeProduct(variantId);
      } else {
        this.cartService.addProduct(
          { ...productToAdd, id: variantId },
          this.count
        );
      }

      this.isInCartState = !this.isInCartState;
      this.cdr.markForCheck();
    });
  }

  fetchProduct(productId: string) {
    this.productService.getProduct(productId).subscribe({
      next: (productData) => {
        if (productData) {
          this.productSubject.next(productData);
          this.updatePrices();
          this.colors = productData.colors || [];
          if (this.colors.length > 0) this.setSelectedColor(0);
          this.isInCartState = this.cartService.isInCart(productData.id);
          this.isFavoriteState = this.favoriteService.isInFavorites(
            productData.id
          );
          this.cdr.detectChanges();
        } else {
          console.warn('[ProductComponent] No product data received.');
        }
      },
      error: (error) => {
        console.error('[ProductComponent] Error fetching product:', error);
      },
    });
  }

  updatePrices() {
    this.product$.subscribe((product) => {
      if (product) {
        this.originalPrice = product.productPrice;
        this.salePrice =
          this.originalPrice * (1 - (product.productSale || 0) / 100);
      }
    });
  }

  setSelectedColor(index: number) {
    this.selectedColorIndex = index;
    this.selectedImage = this.colors[index]?.mainImage || 'default-image.jpg';
    this.selectedColor = this.colors[this.selectedColorIndex];
  }

  selectThumbnail(image: string) {
    this.selectedImage = image;
  }

  selectColor(color: {
    name: string;
    hex: string;
    mainImage?: string | null;
    galleryImages?: string[];
  }) {
    const index = this.colors.findIndex((c) => c.hex === color.hex);
    if (index !== -1) {
      this.setSelectedColor(index);
    }
  }

  get stockStatus(): string {
    return this.selectedColor?.quantity && this.selectedColor.quantity > 0
      ? 'In Stock'
      : 'Out of Stock';
  }

  stringify(obj: any): string {
    return JSON.stringify(obj);
  }

  increase() {
    if (
      this.selectedColor?.quantity &&
      this.count < this.selectedColor.quantity
    ) {
      this.count++;
      this.warningMessage = null;
    } else {
      this.warningMessage = 'You have reached the maximum available quantity!';
    }
  }

  decrease() {
    if (
      this.count > 1 &&
      this.selectedColor?.quantity &&
      this.count <= this.selectedColor.quantity
    ) {
      this.warningMessage = null;
      this.count--;
    }
  }
}
