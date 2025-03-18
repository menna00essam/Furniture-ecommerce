import { Component } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

import { InputComponent } from '../../shared/input/input.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, ButtonComponent, RouterModule],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent {
  token = '';
  message = '';

  resetForm = new FormGroup(
    {
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: this.passwordMatchValidator() }
  );

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.token = this.route.snapshot.queryParams['token'];
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;
      return password === confirmPassword ? null : { passwordMismatch: true };
    };
  }

  resetPassword() {
    this.resetForm.markAllAsTouched(); // Mark fields as touched for validation messages

    if (this.resetForm.valid) {
      this.authService
        .resetPassword(
          this.resetForm.controls['password'].value ?? '',
          this.token
        )
        .subscribe({
          next: () => {
            this.message = 'Password reset successfully';
            this.resetForm.reset();
            this.router.navigate(['/register/login']);
          },
          error: (err) => {
            this.message = 'Error: ' + err.error.message;
          },
        });
    } else {
      console.log('Form invalid');
    }
  }
}
