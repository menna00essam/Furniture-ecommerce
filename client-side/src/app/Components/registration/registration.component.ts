import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-registration',
  imports: [RouterOutlet],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
})
export class RegistrationComponent {
  constructor(private router: Router) {
  }

  isSignUp(): boolean {
    const currentUrl = this.router.url;
    return currentUrl.endsWith('/signup');
  }
}
