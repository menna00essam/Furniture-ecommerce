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
import { take, tap } from 'rxjs/operators';
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
  productcategories: string[] = [];
  salePrice: number = 0;
  isInCartState: boolean = false;
  isFavoriteState: boolean = false;

  private routeSub: Subscription = new Subscription();
  skeletonArr = Array(4);

  productLoading: boolean = true;
  productsLoading: boolean = true;
  btnWidth: string = '150px';

  constructor(
    private cdr: ChangeDetectorRef,
    private productService: ProductService,
    private favoriteService: FavoriteService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.btnWidth = window.innerWidth < 640 ? '340px' : '155px';
    this.routeSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.loadProduct();
      }
    });
    this.loadProduct();
  }

  toggleFavorite() {
    const product = this.productSubject.getValue();
    if (product) {
      this.favoriteService.toggleFavourite(product.id).subscribe({
        next: () => {
          this.isFavoriteState = this.favoriteService.isInFavorites(product.id);
          this.cdr.markForCheck();
        },
      });
    }
  }

  // get dynamicBtnWidth() {
  //   return window.innerWidth < 640 ? '340px' : '155px';
  // }

  getMappedProduct(product: ProductDetails): product {
    return {
      id: product.id,
      name: product.productName,
      image: this.selectedColor?.mainImage || 'default-image.jpg',
      subTitle: product.productSubtitle,
      price: this.salePrice,
      color: this.selectedColor?.name || '',
      quantity: this.count,
      categories: product.productCategories || [],
      date: product.productDate,
      sale: product.productSale,
      colors: [this.selectedColor?.hex || ''],
      sizes: [],
      brand: product.brand,
    };
  }

  toggleCart() {
    const productDetails = this.productSubject.getValue();
    if (!productDetails) {
      console.error('Product details are null.');
      return;
    }
    const product = this.getMappedProduct(productDetails);

    if (!product) {
      this.warningMessage = 'Please select a color first';
      return;
    }

    const variantId = String(product.id);

    if (this.isInCartState) {
      this.cartService.removeProduct(variantId);
    } else {
      this.cartService.addProduct({ ...product, id: variantId }, this.count);
    }

    this.isInCartState = !this.isInCartState;
    this.cdr.markForCheck();
  }

  fetchProduct(productId: string): Observable<ProductDetails> {
    return this.productService.getProduct(productId).pipe(
      tap({
        next: (productData) => {
          if (productData) {
            this.productSubject.next(productData);
            this.originalPrice = productData.productPrice;
            this.productcategories = (productData.productCategories ?? []).map(
              ({ _id }) => _id
            );
            this.salePrice =
              this.originalPrice * (1 - (productData.productSale || 0) / 100);
            this.colors = productData.colors || [];
            if (this.colors.length > 0) this.setSelectedColor(0);
            this.isInCartState = this.cartService.isInCart(productData.id);
            this.isFavoriteState = this.favoriteService.isInFavorites(
              productData.id
            );
            console.log(
              '[ProductComponent -- fetch product] Categories:',
              this.productcategories
            ); // Check if categories are populated correctly
            this.productLoading = false;
            this.fetchProducts();
          } else {
            console.warn('[ProductComponent] No product data received.');
          }
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('[ProductComponent] Error fetching product:', error);
          this.productLoading = false;
          this.cdr.detectChanges();
        },
      })
    );
  }

  // related products
  fetchProducts() {
    console.log(
      '[ProductComponent -- fetch products] Categories:',
      this.productcategories
    );

    this.productService.getProducts(1, 4, this.productcategories).subscribe({
      next: (response) => {
        this.productsLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(
          '[ProductComponent] Error fetching related products:',
          error
        );
        this.productsLoading = false;
        this.cdr.detectChanges();
      },
    });
  }
  loadProduct(): void {
    this.productLoading = true;
    this.productsLoading = true;
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.fetchProduct(this.productId).subscribe(() => {
        console.log('[ProductComponent] Product data fetched successfully.');
        this.relatedProducts$ = this.productService.products$;
      });
    } else {
      console.error('Product ID not found in route parameters.');
    }
  }

  // no need fot it
  // updatePrices() {
  //   this.product$.subscribe((product) => {
  //     if (product) {
  //       this.originalPrice = product.productPrice;
  //       this.salePrice =
  //         this.originalPrice * (1 - (product.productSale || 0) / 100);
  //     }
  //   });
  // }

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
