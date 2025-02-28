import { Component, Input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { product } from '../../models/product.model';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-product-item',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.css',
})
export class ProductItemComponent {
  @Input({ required: true }) product!: product;
}
