import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ProductNavigationComponent } from '../products-components/product-navigation/product-navigation.component';
import { ThumbnailComponent } from '../products-components/thumbnail/thumbnail.component';
import { ProductDescriptionComponent } from '../products-components/product-description/product-description.component';

@Component({
  selector: 'app-product',
  imports: [
    ProductNavigationComponent,
    ThumbnailComponent,
    ProductDescriptionComponent,
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent {}
