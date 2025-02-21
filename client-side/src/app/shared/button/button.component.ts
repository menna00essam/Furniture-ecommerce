import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent {
  @Input() type: 'filledBtn' | 'outlinedBtn'| 'plainBtn' = 'filledBtn';
  @Input() btnPadding: string = '10px';
  @Input() btnWidth: string = '150px';
}
