import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownComponent } from '../dropdown/dropdown.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownComponent],
  template: `
    <div
      class="relative flex h-full w-48 cursor-pointer items-center rounded-md border border-gray-medium bg-white p-1"
    >
      <!-- Search Input -->
      <input
        type="text"
        class="w-full focus:outline-none"
        [(ngModel)]="searchValue"
        (focus)="toggleDropdown(true)"
        (input)="onSearchInput()"
      />

      <!-- Search Icon -->
      <img src="icons/search.svg" alt="Search" class="w-5" />

      <!-- Dropdown (only appears when menu is open and filtered items exist) -->
      <app-dropdown
        *ngIf="isMenuOpen && filteredItems.length > 0"
        [items]="filteredItems"
        (selectedValueChange)="updateValue($event)"
      ></app-dropdown>
    </div>
  `,
})
export class SearchComponent {
  @Input() items: string[] = [];

  searchValue: string = '';
  filteredItems: string[] = [];
  isMenuOpen: boolean = false;
  private timeout: ReturnType<typeof setTimeout> | null = null;

  /** Handles input debounce and triggers filtering */
  onSearchInput(): void {
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.filterSearchResults(), 300);
  }

  /** Filters search results based on user input */
  private filterSearchResults(): void {
    const query = this.searchValue.toLowerCase().trim();
    this.filteredItems = query
      ? this.items
          .filter((item) => item.toLowerCase().includes(query))
          .splice(0, 5)
      : [];
  }

  /** Updates input value and closes dropdown */
  updateValue(value: string): void {
    this.searchValue = value;
    this.toggleDropdown(false);
  }

  /** Toggles dropdown visibility */
  toggleDropdown(open: boolean): void {
    this.isMenuOpen = open;
  }
}
