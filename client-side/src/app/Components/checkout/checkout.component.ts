import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderBannerComponent } from '../shared/header-banner/header-banner.component';
import { FeatureBannerComponent } from '../shared/feature-banner/feature-banner.component';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '../shared/button/button.component';
import { CartService } from '../../Services/cart.service';
import { CurrencyPipe } from '@angular/common';
import { PaymentComponent } from '../payment/payment.component';
import { CheckoutService } from '../../Services/checkout.service';

import { StepperComponent } from '../shared/stepper/stepper.component';


export function noNumbersValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const hasNumber = /\d/.test(control.value);
    return hasNumber ? { hasNumber: { value: control.value } } : null;
  };
}

@Component({
  selector: 'app-checkout',
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
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
  animations: [
    trigger('slideUpDown', [
      state('in', style({ height: '*', opacity: 1 })),
      state('out', style({ height: '0', opacity: 0 })),
      transition('in <=> out', animate('200ms ease-in-out')),
    ]),
  ],
})
export class CheckoutComponent {
  checkoutForm: FormGroup;
  selectedPayment: string = '';
  cartItems: any[] = [];
  subtotal: number = 0;
  @ViewChild(PaymentComponent) paymentComponent!: PaymentComponent;

  constructor(
    private fb: FormBuilder,
    private checkoutService: CheckoutService,
    private cartService: CartService
  ) {
    this.checkoutForm = this.fb.group({
      firstName: ['', [Validators.required, noNumbersValidator()]],
      lastName: ['', [Validators.required]],
      companyName: [''],
      country: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', [Validators.required]],
      zip: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      email: ['', [Validators.required, Validators.email]],
      additionalInfo: [''],
      paymentMethod: ['', Validators.required],
    });

    this.cartItems = this.cartService.getCheckoutData();
    this.subtotal = this.cartService.getSubtotal();
    // console.log('Cart Items>>>>>>>>>>', this.cartItems);
  }

  onSubmit() {
    this.checkoutForm.markAllAsTouched();
    this.checkoutForm.patchValue({
      paymentMethod: this.selectedPayment,
    });

    const checkoutValidation = this.checkoutService.validateCheckoutForm(
      this.checkoutForm.value
    );
    // console.log('Checkout Validation>>>>>', checkoutValidation);

    let paymentValidation: { isValid: boolean; errors: string[] } = {
      isValid: true,
      errors: [],
    };

    if (
      (this.selectedPayment === 'bank' || this.selectedPayment === 'cod') &&
      this.paymentComponent
    ) {
      this.paymentComponent.paymentForm.markAllAsTouched();
      paymentValidation = this.checkoutService.validatePaymentForm(
        this.paymentComponent.paymentForm.value
      );
      // console.log('Payment Validation>>>>>', paymentValidation);
    }

    if (
      !checkoutValidation.isValid ||
      (this.selectedPayment === 'bank' && !paymentValidation.isValid)
    ) {
      console.log('Form is invalid>>> Errors:', [
        ...checkoutValidation.errors,
        ...paymentValidation.errors,
      ]);
      return;
    }

    console.log('Checkout successfully!', this.checkoutForm.value);
    this.checkoutForm.reset();
    this.checkoutForm.markAsPristine();
    this.checkoutForm.markAsUntouched();

    if (this.selectedPayment === 'bank' && this.paymentComponent) {
      this.paymentComponent.paymentForm.reset();
      this.paymentComponent.paymentForm.markAsPristine();
      this.paymentComponent.paymentForm.markAsUntouched();
    }

    this.selectedPayment = '';
  }
}
