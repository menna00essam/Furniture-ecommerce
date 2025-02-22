import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../shared/button/button.component';

@Component({
  selector: 'app-header',
  imports: [RouterModule, ButtonComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  isActive = false;
  favModalShow = false;
  cartModalShow = false;

  toggleMenu() {
    this.isActive = !this.isActive;
  }
  toggleFavModal(open: boolean) {
    this.favModalShow = open;
    if (open) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'auto';
    }
  }
  toggleCartModal(open: boolean) {
    this.cartModalShow = open;
    if (open) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'auto';
    }
  }
}
