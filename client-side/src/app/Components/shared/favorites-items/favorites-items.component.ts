import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { product } from '../../../Models/product.model';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../Services/cart.service';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../button/button.component';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-favorites-items',
  imports: [ButtonComponent, CommonModule, RouterModule],
  templateUrl: './favorites-items.component.html',
  styleUrl: './favorites-items.component.css',
})
export class FavoritesItemsComponent implements OnInit {
  favorites: product[] = [];
  cart$!: Observable<product[]>;
  constructor(
    private cdr: ChangeDetectorRef,
    private cartService: CartService
  ) {}
  ngOnInit(): void {
    this.cart$ = this.cartService.cart$;
    this.cartService.getCart().subscribe();
  }

  addToCart(product: product) {
    if (this.isInCart(product.id)) {
      this.cartService.removeProduct(product.id);
    } else {
      this.cartService.addProduct(product);
    }
    this.cdr.detectChanges();
  }

  isInCart(productId: string): Observable<boolean> {
    return this.cartService.cart$.pipe(
      map((cart) => cart.some((p) => p.id === productId))
    );
  }
}
