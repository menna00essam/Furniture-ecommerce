import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="absolute top-full left-0 bg-white w-full rounded-md p-2 mt-2 z-10"
    >
      <ul class="flex flex-col">
        <li
          *ngFor="let item of items"
          (click)="selectItem(item)"
          class="p-2 duration-300 ease-in-out cursor-pointer rounded-md hover:bg-secondary"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  `,
})
export class DropdownComponent {
  @Input() items: string[] = [];
  @Output() selectedValueChange = new EventEmitter<string>();
  activeItem = '';

  selectItem(item: string) {
    this.activeItem = item;
    this.selectedValueChange.emit(item);
  }
}
