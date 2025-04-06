import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent } from '../../shared/button/button.component';
import { MatDialogClose } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';

export
@Component({
  selector: 'contact-confirm-modal',
  imports: [MatDialogClose, ButtonComponent, RouterModule],
  template: `
    <div class="flex flex-col items-center text-center p-6 space-y-4">
      <div class="flex flex-col items-center text-center p-6 space-y-4">
        <div class=" rounded-full h-10 w-10 text-red">
          <img src="icons/check.svg" alt="checkmark" />
        </div>
        <p class="text-lg font-medium text-gray-800">
          Thank you for reaching out!
        </p>
        <p class="text-sm text-gray-600">
          We will get back to you as soon as we can.
        </p>
      </div>

      <div>
        <app-button mat-dialog-close btnWidth="auto" [routerLink]="['/shop']"
          >Countine Shopping</app-button
        >
      </div>
    </div>
  `,

  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ContactConfirmModalComponent {}
