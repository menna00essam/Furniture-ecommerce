import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CheckoutService } from '../../Services/checkout.service';

@Component({
  selector: 'app-payment',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css',
})
export class PaymentComponent {
  paymentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private checkoutService: CheckoutService
  ) {
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiry: [
        '',
        [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)],
      ],
      cvc: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
    });
  }
  validatePaymentForm() {
    const paymentValidation = this.checkoutService.validatePaymentForm(
      this.paymentForm.value
    );

    if (paymentValidation.isValid) {
      console.log('Payment Form is valid:', this.paymentForm.value);
    } else {
      console.error('Payment invalid:', paymentValidation.errors);
    }
  }
}
