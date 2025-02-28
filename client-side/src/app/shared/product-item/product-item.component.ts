import {
  Component,
  Input,
  ChangeDetectionStrategy,
  HostListener,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { product } from '../../models/product.model';
import { ButtonComponent } from '../button/button.component';
import { RouterModule } from '@angular/router';
import {
  trigger,
  transition,
  animate,
  style,
  state,
} from '@angular/animations';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [CommonModule, ButtonComponent, RouterModule],
  providers: [CurrencyPipe],
  templateUrl: './product-item.component.html',
  animations: [
    trigger('slideInOut', [
      state('in', style({ transform: 'translateY(0%)', opacity: 1 })),
      state('out', style({ transform: 'translateY(100%)', opacity: 0 })),
      transition('in <=> out', [animate('300ms ease-in-out')]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductItemComponent implements OnInit {
  @Input({ required: true }) product!: product;
  isHovered = false;
  disableAnimation = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.checkScreenSize();
  }

  onMouseEnter() {
    if (!this.disableAnimation) this.isHovered = true;
  }

  onMouseLeave() {
    if (!this.disableAnimation) this.isHovered = false;
  }

  @HostListener('window:resize')
  checkScreenSize() {
    const isSmallScreen = window.innerWidth < 1024;
    if (this.disableAnimation !== isSmallScreen) {
      this.disableAnimation = isSmallScreen;
      this.isHovered = isSmallScreen;
      this.cdr.detectChanges(); // Force UI update
    }
  }
}
