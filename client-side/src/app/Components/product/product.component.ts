import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../Services/product.service';

import { ProductNavigationComponent } from '../products-components/product-navigation/product-navigation.component';
import { ThumbnailComponent } from '../products-components/thumbnail/thumbnail.component';
import { ProductDescriptionComponent } from '../products-components/product-description/product-description.component';
import { ButtonComponent } from '../shared/button/button.component';
import { ProductDetails } from '../../Models/product-details.model';
import { Component, OnInit } from '@angular/core';
import { ProductItemComponent } from '../shared/product-item/product-item.component';

@Component({
  selector: 'app-product',
  imports: [
    CommonModule,
    ButtonComponent,
    ProductNavigationComponent,
    ThumbnailComponent,
    ProductDescriptionComponent,
    ProductItemComponent,
  ],
  templateUrl: './product.component.html',
})
export class ProductComponent implements OnInit {
  productId: string | null = null;
  product!: ProductDetails;
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

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.fetchProduct(this.productId);
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

  getMappedProduct(): any {
    return {
      name: this.product.productName,
      subTitle: this.product.productDescription,
      price: this.product.productPrice,
      // Add other required mappings here
    };
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
