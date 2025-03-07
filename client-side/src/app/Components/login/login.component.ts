import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../input/input.component';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../shared/button/button.component';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, InputComponent, RouterModule, ButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  form = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
    ]),
  });
  onSubmit() {
    this.form.controls.email.markAsTouched();
    this.form.controls.password.markAsTouched();
    if (this.form.valid) {
      console.log(this.form.value);
      this.form.reset();
    } else {
      console.error('Form invalid');
    }
  }
}
