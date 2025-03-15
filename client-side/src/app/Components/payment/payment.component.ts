import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CheckoutService } from '../../Services/checkout.service';
import { InputComponent } from '../shared/input/input.component'; 

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputComponent], 
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

  // Getter methods for form controls
  get cardNumber(): FormControl {
    return this.paymentForm.get('cardNumber') as FormControl;
  }

  get expiry(): FormControl {
    return this.paymentForm.get('expiry') as FormControl;
  }

  get cvc(): FormControl {
    return this.paymentForm.get('cvc') as FormControl;
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