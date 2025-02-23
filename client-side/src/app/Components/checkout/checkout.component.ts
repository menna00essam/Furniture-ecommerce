import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderBannerComponent } from '../header-banner/header-banner.component';
import { FeatureBannerComponent } from '../feature-banner/feature-banner.component';

@Component({
  selector: 'app-checkout',
  imports: [
    CommonModule,
    FormsModule,
    HeaderBannerComponent,
    FeatureBannerComponent,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  selectedPayment: string = '';
}
