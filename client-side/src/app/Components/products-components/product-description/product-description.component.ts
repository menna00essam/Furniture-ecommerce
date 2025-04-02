import { TitleCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-description',
  imports: [TitleCasePipe],
  providers: [],
  templateUrl: './product-description.component.html',
})
export class ProductDescriptionComponent {
  @Input() description?: string = '';
  @Input() additionalInfo?: any;
  @Input() imageUrls?: string[] = [];
  activeTab: string = 'description';
  switchTab(tab: string) {
    this.activeTab = tab;
  }
  formattedAdditionalInfo(): string {
    try {
      const parsedInfo = JSON.parse(this.additionalInfo);
      return JSON.stringify(parsedInfo, null, 2)
        .replace(/\n/g, '<br>')
        .replace(/\s/g, '&nbsp;');
    } catch (e) {
      return this.additionalInfo; // Return as is if it's not JSON
    }
  }
  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}
