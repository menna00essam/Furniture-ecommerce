// dropdown.component.ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  imports: [CommonModule],
  template: `
    <div class="relative menu-container">
      <button
        class="bg-white h-14 flex items-center px-5 cursor-pointer w-full min-w-48 border border-gray-300 rounded-md focus:outline-none"
        (click)="toggleMenu()"
      >
        <span class="text-gray-700">{{ selectedValue }}</span>
      </button>

      <div
        *ngIf="isMenuOpen"
        class="absolute top-full left-0 bg-white w-full max-w-[300px] rounded-md shadow-md p-2 mt-2 z-10"
      >
        <ul class="flex flex-col">
          <li
            *ngFor="let item of items"
            (click)="selectItem(item)"
            [ngClass]="{
              'bg-dark': activeItem === item,
              'hover:bg-light': activeItem !== item
            }"
            class="p-2 duration-300 ease-in-out cursor-pointer rounded-md"
          >
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  `,
})
export class DropdownComponent {
  @Input() items: string[] = [];
  @Input() selectedValue: string = '';
  @Output() selectedValueChange = new EventEmitter<string>();

  isMenuOpen: boolean = false;
  activeItem: string = '';

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  selectItem(item: string) {
    this.selectedValue = item;
    this.activeItem = item;
    this.isMenuOpen = false;
    this.selectedValueChange.emit(item);
  }
}
