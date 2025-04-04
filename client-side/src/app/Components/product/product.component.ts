import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../Services/product.service';
import { ProductNavigationComponent } from '../products-components/product-navigation/product-navigation.component';
import { ThumbnailComponent } from '../products-components/thumbnail/thumbnail.component';
import { ProductDescriptionComponent } from '../products-components/product-description/product-description.component';
import { ButtonComponent } from '../shared/button/button.component';
import { ProductDetails } from '../../Models/product-details.model';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductItemComponent } from '../shared/product-item/product-item.component';
import { FavoriteService } from '../../Services/favorite.service';
import { CartService } from '../../Services/cart.service';
import { Observable } from 'rxjs/internal/Observable';
import { product } from '../../Models/product.model';

@Component({
  selector: 'app-product',
  imports: [
    CommonModule,
    ButtonComponent,
    ProductNavigationComponent,
    ThumbnailComponent,
    RouterModule,
    ProductDescriptionComponent,
    ProductItemComponent,
  ],
  templateUrl: './product.component.html',
})
export class ProductComponent implements OnInit {
  productId: string | null = null;
  product!: ProductDetails;
  products$!: Observable<product[]>;
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
  selectedImage: string | null = null;
  count: number = 1;
  originalPrice: number = 0;
  salePrice: number = 0;
  isInCartState: boolean = false;
  isFavoriteState: boolean = false;

  cart$: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private productService: ProductService,
    private favoriteService: FavoriteService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.fetchProduct(this.productId);
    }
    this.products$ = this.productService.products$;
    this.cart$ = this.cartService.cart$;
    this.productService.getProducts(1, 5).subscribe();
  }
  toggleFavourites() {
    this.favoriteService.toggleFavourite(this.product.id).subscribe(() => {
      this.isFavoriteState = this.favoriteService.isInFavorites(
        this.product.id
      );
      this.cdr.markForCheck();
    });
  }
  // In your ProductComponent class

  getMappedProduct(): product {
    if (!this.selectedColor) {
      throw new Error('Please select a color first');
    }

    return {
      id: this.product.id, // The main product ID
      name: this.product.productName,
      image: this.selectedColor.mainImage || 'default-image.jpg',
      subTitle: this.product.productSubtitle,
      price: this.salePrice,
      color: this.selectedColor.name, // Selected color name
      quantity: this.count,
      categories: this.product.productCategories || [],
      date: this.product.productDate,
      sale: this.product.productSale,
      colors: [this.selectedColor.hex], // Current color variant
      sizes: [], // Add sizes if needed
      brand: this.product.brand,
    };
  }

  toggleCart() {
    try {
      const productToAdd = this.getMappedProduct();

      if (this.isInCartState) {
        // Remove by product ID (service limitation)
        this.cartService.removeProduct(productToAdd.id);
      } else {
        // Add with color info in the product object
        this.cartService.addProduct(productToAdd);
      }

      this.isInCartState = !this.isInCartState;
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error:', error);
      this.warningMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      setTimeout(() => (this.warningMessage = null), 3000);
    }
  }

  fetchProduct(productId: string) {
    this.productService.getProduct(productId).subscribe({
      next: (productData) => {
        console.log('[ProductComponent] Received Product:', productData);

        if (productData) {
          this.product = productData as ProductDetails;
          this.updatePrices();

          // Ensure colors array exists and map correctly
          this.colors = Array.isArray(productData.colors)
            ? productData.colors.map((c: any) => ({
                name: c.name || 'Unknown',
                hex: c.hex || '#000000',
                mainImage: c.mainImage || c.galleryImages?.[0] || null,
                galleryImages: Array.isArray(c.galleryImages)
                  ? c.galleryImages.slice(0, 6)
                  : [],
                quantity: c.quantity ?? 0,
              }))
            : [];

          if (this.colors.length > 0) {
            this.setSelectedColor(0);
          }
          this.isInCartState = this.cartService.isInCart(this.product.id);
          this.isFavoriteState = this.favoriteService.isInFavorites(
            this.product.id
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
    this.originalPrice = this.product.productPrice;
    console.log('original price :', this.originalPrice);
    const salePercentage = this.product.productSale || 0;
    this.salePrice = this.originalPrice * (1 - salePercentage / 100) || 0;
    console.log('saleprice :', this.salePrice);
  }

  /**
   * Sets the selected color and updates images accordingly.
   */
  setSelectedColor(index: number) {
    this.selectedColorIndex = index;
    this.selectedImage = this.colors[index]?.mainImage || null;
  }
  get selectedColor() {
    return this.colors[this.selectedColorIndex] || null;
  }

  /**
   * Updates the main image when clicking a thumbnail.
   */
  selectThumbnail(image: string) {
    this.selectedImage = image;
  }

  /**
   * Handles color selection and updates the displayed image.
   */
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
    if (!this.selectedColor?.quantity || this.selectedColor.quantity <= 0) {
      console.log('quantitttttyyyyyyyyyy :', this.selectedColor?.quantity);
      return 'Out of Stock';
    }
    console.log('quantitttttyyyyyyyyyy :', this.selectedColor?.quantity);
    return 'In Stock';
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
