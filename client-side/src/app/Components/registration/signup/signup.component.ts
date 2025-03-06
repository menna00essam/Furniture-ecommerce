import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../../shared/input/input.component';
import { Router, RouterModule } from '@angular/router';
import { ButtonComponent } from '../../shared/button/button.component';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, InputComponent, ButtonComponent, RouterModule],
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  errorMessage: string = '';
  form = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    username: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern('^[a-zA-Z]*$'),
    ]),
    phone: new FormControl(null, [
      Validators.required,
      Validators.minLength(11),
      Validators.pattern('^[0-9]*$'),
    ]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
    ]),
  });
  constructor(private authService: AuthService, private router: Router) {}
  onSubmit() {
    this.form.controls.email.markAsTouched();
    this.form.controls.username.markAsTouched();
    this.form.controls.phone.markAsTouched();
    this.form.controls.password.markAsTouched();
    if (this.form.valid) {
      this.authService.signup(this.form.value).subscribe({
        next: (res) => {
          this.form.reset();
          this.router.navigate(['/register/login']);
        },
        error: (err) => {
          this.errorMessage = err.error.error;
        },
      });
    } else {
      console.error('Form invalid');
    }
  }
}
