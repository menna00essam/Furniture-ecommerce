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
  constructor(private authService: AuthService) {}
  onSubmit() {
    this.form.controls.email.markAsTouched();
    this.form.controls.password.markAsTouched();
    if (this.form.valid) {
      console.log(this.form.value);
      this.authService.login(this.form.value).subscribe({
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
