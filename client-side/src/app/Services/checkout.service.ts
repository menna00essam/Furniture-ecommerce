import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, Subject , throwError } from 'rxjs';
import { CheckoutData } from '../models/checkout.model';
import { AuthService } from './auth.service';
import { NgToastService } from 'ng-angular-popup';
import { productCart } from '../models/productCart.model';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private apiUrl = `${environment.apiUrl}/checkout`;
  private paymentApiUrl = `${environment.apiUrl}/payments/payment`;
  paymentIntentId: string = ''; 
  clientSecret: string = '';
  paymentCompleted = new Subject<boolean>(); 
  checkoutSubject: any;
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private toast: NgToastService
   ) {}

   private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
  placeOrder(checkoutData: CheckoutData): Observable<any> {
    return this.http.post(this.apiUrl, checkoutData, {
      headers: this.getAuthHeaders(),
    }).pipe(
      catchError((error) => {
        this.toast.danger('Failed to place order. Please try again.');
        return throwError(() => error);
      })
    );
  }

  createPaymentIntent(amount: number): Observable<any> {
    return this.http.post(this.paymentApiUrl, { amount }, {
      headers: this.getAuthHeaders(),
    }).pipe(
      catchError((error) => {
        this.toast.danger('Payment processing failed.');
        return throwError(() => error);
      })
    );
  }

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
