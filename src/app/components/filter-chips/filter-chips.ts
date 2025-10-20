import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-filter-chips',
  imports: [CommonModule],
  template: `
    <div class="filter-section">
      <label class="filter-label">{{ label() }}</label>
      <div class="filter-chips">
        @for (item of items(); track item) {
          <button class="filter-chip" [class.active]="isSelected(item)" (click)="onToggle(item)">
            {{ item }}
          </button>
        }
      </div>
    </div>
  `,
  styleUrl: './filter-chips.css',
})
export class FilterChips<T extends string = string> {
  readonly label = input.required<string>();
  readonly items = input.required<T[]>();
  readonly selectedItems = input.required<T[]>();

  readonly toggle = output<T>();

  isSelected(item: T): boolean {
    return this.selectedItems().includes(item);
  }

  onToggle(item: T): void {
    this.toggle.emit(item);
  }
}
