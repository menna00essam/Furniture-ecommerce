import { Component, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn,
  ReactiveFormsModule,
  FormsModule,
  FormControl,
} from '@angular/forms';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

import { HeaderBannerComponent } from '../shared/header-banner/header-banner.component';
import { FeatureBannerComponent } from '../shared/feature-banner/feature-banner.component';
import { PaymentComponent } from '../payment/payment.component';
import { ButtonComponent } from '../shared/button/button.component';
import { StepperComponent } from '../shared/stepper/stepper.component';
import { InputComponent } from '../shared/input/input.component';

import { CartService } from '../../Services/cart.service';
import { CheckoutService } from '../../Services/checkout.service';

// Custom Validator: No Numbers
export function noNumbersValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    return /\d/.test(control.value)
      ? { hasNumber: { value: control.value } }
      : null;
  };
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    HeaderBannerComponent,
    FeatureBannerComponent,
    PaymentComponent,
    ButtonComponent,
    CurrencyPipe,
    StepperComponent,
    InputComponent,
  ],
  templateUrl: './checkout.component.html',
  animations: [
    trigger('slideUpDown', [
      state('in', style({ height: '*', opacity: 1 })),
      state('out', style({ height: '0', opacity: 0 })),
      transition('in <=> out', animate('400ms ease-in-out')),
    ]),
  ],
})
export class CheckoutComponent {
  checkoutForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, noNumbersValidator()]),
    lastName: new FormControl('', [Validators.required, noNumbersValidator()]),
    companyName: new FormControl(''),
    country: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    city: new FormControl('', [Validators.required, noNumbersValidator()]),
    zip: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d+$/),
    ]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d+$/),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    additionalInfo: new FormControl(''),
    paymentMethod: new FormControl('', Validators.required),
  });

  selectedPayment: string = '';
  cartItems: any[] = [];
  subtotal: number = 0;

  @ViewChild(PaymentComponent) paymentComponent!: PaymentComponent;

  constructor(
    private checkoutService: CheckoutService,
    private cartService: CartService
  ) {
    this.loadCartData();
  }

  /** Load cart data on component initialization */
  private loadCartData(): void {
    this.cartItems = this.cartService.getCheckoutData();
    this.subtotal = this.cartService.getSubtotal();
  }

  /** Handle form submission */
  onSubmit(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const billingValues = this.checkoutForm.value;
    const paymentValues = this.paymentComponent?.paymentForm?.value || {};

    const billingValidation =
      this.checkoutService.validateCheckoutForm(billingValues);
    const paymentValidation =
      billingValues.paymentMethod === 'bank'
        ? this.checkoutService.validatePaymentForm(paymentValues)
        : { errors: [] };

    const errors: string[] = [
      ...billingValidation.errors,
      ...paymentValidation.errors,
    ];

    if (errors.length > 0) {
      console.error('Validation failed:', errors);
      this.checkoutForm.markAllAsTouched();
      this.paymentComponent?.paymentForm?.markAllAsTouched();
      return;
    }

    this.processOrder(billingValues, paymentValues);
  }

  /** Process the order after successful validation */
  private processOrder(billingValues: any, paymentValues: any): void {
    this.selectedPayment = billingValues.paymentMethod;
    this.checkoutService.processOrder(billingValues, paymentValues);

    // Reset forms
    this.checkoutForm.reset();
    this.paymentComponent?.paymentForm?.reset();
    this.selectedPayment = '';

    // Clear cart
    this.cartItems = [];
    this.subtotal = 0;
    this.cartService.clearCart();
  }
}
