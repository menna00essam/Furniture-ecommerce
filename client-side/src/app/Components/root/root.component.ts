import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { NgToastModule } from 'ng-angular-popup';
import { ToasterPosition } from 'ng-angular-popup';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, RouterOutlet, FooterComponent, NgToastModule],
  templateUrl: './root.component.html',
  styleUrl: './root.component.css',
})
export class RootComponent {
  ToasterPosition = ToasterPosition;
}
