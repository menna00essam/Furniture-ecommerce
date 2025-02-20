// filter-option.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-filter-option',
  imports: [CommonModule],
  template: `
    <div class="border-t border-gray-light">
      <div
        class="filterOption flex items-center justify-between py-3 cursor-pointer"
        (click)="toggleActive()"
      >
        <div>
          <span class="text-lg font-bold">{{ title }}</span>
        </div>
        <div>
          <img
            src="icons/arrow.svg"
            class="rotate-[90deg] duration-300 ease"
            [ngClass]="{ 'rotate-[270deg]': isActive }"
            alt=""
          />
        </div>
      </div>
      <div class="optionsMenu" [class.hidden]="!isActive">
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class FilterOptionComponent {
  @Input() title: string = '';
  isActive: boolean = false;

  toggleActive() {
    this.isActive = !this.isActive;
  }
}
