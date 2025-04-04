import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-accordion',
  imports: [],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.css',
})
export class AccordionComponent {
  @Input() title: string = '';
  isOpen: boolean = false;
  toggle() {
    this.isOpen = !this.isOpen;
  }
}
