import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-stepper',
  standalone: true,
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.css',
  imports: [MatButtonModule, MatInputModule, CommonModule],
})
export class StepperComponent {
    steps = ['cart', 'checkout', 'order-complete'];
    stepIndex = 0;
  
    constructor(private router: Router) {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.updateStep(event.url);
        }
      });
    }
  
    updateStep(url: string) {
      // Extract last part of URL to determine the step
      const currentStep = url.split('/').pop();
      this.stepIndex = this.steps.indexOf(currentStep || 'cart');
    }
  }