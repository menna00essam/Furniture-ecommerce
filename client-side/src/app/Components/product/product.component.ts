import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../Services/product.service';

import { HeaderComponent } from '../root/header/header.component';
import { ProductNavigationComponent } from '../products-components/product-navigation/product-navigation.component';
import { ThumbnailComponent } from '../products-components/thumbnail/thumbnail.component';
import { ProductDescriptionComponent } from '../products-components/product-description/product-description.component';
import { ButtonComponent } from '../shared/button/button.component';
import { ProductItemComponent } from '../shared/product-item/product-item.component';
import { ProductDetails } from '../../models/product-details.model';

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
  product: any = {};
  colors: {
    name: string;
    hex: string;
    mainImage?: string | null;
    galleryImages?: string[];
  }[] = [];
  selectedImage: string | null = null;

  count: number = 1;

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

          // Ensure colors array exists and use the correct property names
          this.colors = Array.isArray(productData.colors)
            ? productData.colors.map((c: any) => ({
                name: c.name || 'Unknown',
                hex: c.hex || '#000000',
                mainImage: c.mainImage || null,
                galleryImages: Array.isArray(c.galleryImages)
                  ? c.galleryImages
                  : [],
              }))
            : [];

          if (this.colors.length > 0) {
            this.selectedImage = this.colors[0].mainImage ?? null;
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

  selectColor(color: any) {
    if (color) {
      this.selectedImage = color.mainImage || color.galleryImages[0] || null;
    }
  }
  increase() {
    this.count++;
  }

  decrease() {
    if (this.count > 1) this.count--;
  }
}
