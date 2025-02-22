import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-totals',
  templateUrl: './cart-totals.component.html',
  styleUrls: ['./cart-totals.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class CartTotalsComponent {
  constructor(private router: Router) {}
  @Input() subtotal: number = 0;
  goToCheckout() {
    this.router.navigate(['/checkout']);
  }
}