import { Component, Input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/button/button.component';

@Component({
  selector: 'app-cart-totals',
  templateUrl: './cart-totals.component.html',
  styleUrls: ['./cart-totals.component.css'],
  standalone: true,
  imports: [CommonModule, ButtonComponent, CurrencyPipe],
})
export class CartTotalsComponent {
  constructor(private router: Router) {}
  @Input() subtotal: number = 0;
  goToCheckout() {
    this.router.navigate(['/checkout']);
  }
}
