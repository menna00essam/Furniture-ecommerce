import { Component } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { ButtonComponent } from '../../shared/button/button.component';
@Component({
  selector: 'app-home',
  imports: [ButtonComponent,UpperCasePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
