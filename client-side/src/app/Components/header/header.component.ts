import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from '../search/search.component';
import { UserActionsComponent } from '../user-actions/user-actions.component';
import { NavigationComponent } from '../navigation/navigation.component';
import { ProductService } from '../../Services/product.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    SearchComponent,
    UserActionsComponent,
    NavigationComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  isActive = false;
  productsNames: string[];

  constructor(private productService: ProductService) {
    this.productsNames = this.productService.getProductNames();
  }

  toggleMenu() {
    this.isActive = !this.isActive;
  }
}
