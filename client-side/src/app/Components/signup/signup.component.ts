import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../input/input.component';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, InputComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
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
  onSubmit() {
    this.form.controls.email.markAsTouched();
    this.form.controls.name.markAsTouched();
    this.form.controls.phone.markAsTouched();
    this.form.controls.password.markAsTouched();
    if (this.form.valid) {
      console.log(this.form.value);
      this.form.reset();
    } else {
      console.error('Form invalid');
    }
  }
}
