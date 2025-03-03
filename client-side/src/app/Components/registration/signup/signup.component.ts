import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../../shared/input/input.component';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../shared/button/button.component';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, InputComponent, ButtonComponent, RouterModule],
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  form = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    name: new FormControl(null, [
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
  constructor(private authService: AuthService) {}
  onSubmit() {
    this.form.controls.email.markAsTouched();
    this.form.controls.name.markAsTouched();
    this.form.controls.phone.markAsTouched();
    this.form.controls.password.markAsTouched();
    if (this.form.valid) {
      console.log(this.form.value);
      this.authService.signup(this.form.value).subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => {
          console.error(err.error.message);
        },
      });
      this.form.reset();
    } else {
      console.error('Form invalid');
    }
  }
}
