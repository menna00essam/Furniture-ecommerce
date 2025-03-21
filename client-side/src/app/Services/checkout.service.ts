import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  constructor() {}

  //*** validation for billing-details ***/
  validateCheckoutForm(formValues: any): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!formValues.firstName) {
      errors.push('First Name is required');
    }
    if (!formValues.lastName) {
      errors.push('Last Name is required');
    }
    if (!formValues.country) {
      errors.push('Country is required');
    }
    if (!formValues.address) {
      errors.push('Address is required');
    }
    if (!formValues.city) {
      errors.push('City is required');
    }
    if (!formValues.zip) {
      errors.push('Zip Code is required');
    }
    if (!formValues.phone) {
      errors.push('Phone is required');
    }
    if (!formValues.email || !this.isValidEmail(formValues.email)) {
      errors.push('Please enter a valid email');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  //*** validation for payment-methods ***/
  validatePaymentForm(formValues: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!formValues.cardNumber) {
      errors.push('Card number is required.');
    }
    if (!formValues.expiry) {
      errors.push('Expiry date is required.');
    }
    if (!formValues.cvc) {
      errors.push('CVC is required.');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
  processOrder(billingValues: any,paymentValues: any) {
    console.log('payment details>>>>>', { billingValues, paymentValues });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
