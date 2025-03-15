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
  FormControl,
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
import { RouterModule } from '@angular/router';
import { InputComponent } from '../shared/input/input.component';


export function noNumbersValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const hasNumber = /\d/.test(control.value);
    return hasNumber ? { hasNumber: { value: control.value } } : null;
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
  // styleUrl: './checkout.component.css',
  animations: [
    trigger('slideUpDown', [
      state('in', style({ height: '*', opacity: 1 })),
      state('out', style({ height: '0', opacity: 0 })),
      transition('in <=> out', animate('400ms ease-in-out')),
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
      lastName: ['', [Validators.required, noNumbersValidator()]],
      companyName: [''],
      country: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', [Validators.required, noNumbersValidator()]],
      zip: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      email: ['', [Validators.required, Validators.email]],
      additionalInfo: [''],
      paymentMethod: ['', Validators.required], 
    });
    this.cartItems = this.cartService.getCheckoutData();
    this.subtotal = this.cartService.getSubtotal();
  }

  get firstName(): FormControl {
    return this.checkoutForm.get('firstName') as FormControl;
  }

  get lastName(): FormControl {
    return this.checkoutForm.get('lastName') as FormControl;
  }

  get companyName(): FormControl {
    return this.checkoutForm.get('companyName') as FormControl;
  }

  get country(): FormControl {
    return this.checkoutForm.get('country') as FormControl;
  }

  get address(): FormControl {
    return this.checkoutForm.get('address') as FormControl;
  }

  get city(): FormControl {
    return this.checkoutForm.get('city') as FormControl;
  }

  get zip(): FormControl {
    return this.checkoutForm.get('zip') as FormControl;
  }

  get phone(): FormControl {
    return this.checkoutForm.get('phone') as FormControl;
  }

  get email(): FormControl {
    return this.checkoutForm.get('email') as FormControl;
  }

  onSubmit() {
    const billingValues = this.checkoutForm.value;
    const paymentValues = this.paymentComponent?.paymentForm?.value; 
  

    const billingValidation = this.checkoutService.validateCheckoutForm(billingValues);
    const paymentValidation = this.checkoutService.validatePaymentForm(paymentValues);
  

    let errors: string[] = [...billingValidation.errors];
  

    if (billingValues.paymentMethod === 'bank') {
      errors = [...errors, ...paymentValidation.errors];
    }
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    if (errors.length > 0) {
      console.error("Validation failed:", errors);
      this.checkoutForm.markAllAsTouched();
      this.paymentComponent?.paymentForm?.markAllAsTouched();
      return;
    }
    this.selectedPayment = billingValues.paymentMethod;
  // console.log("Payment Method>>>>>", this.selectedPayment);
    // console.log("payment details>>>>>", { billingDetails: billingValues, paymentDetails: paymentValues });
    //*** reste forms ***/ 
  this.checkoutForm.reset();
  this.paymentComponent?.paymentForm?.reset();
  this.selectedPayment = '';

  //*** reste cart And product price ***/ 
  this.cartItems = [];
  this.subtotal = 0;
  this.cartService.clearCart();

    this.checkoutService.processOrder(billingValues,paymentValues);
  }
  
  
}