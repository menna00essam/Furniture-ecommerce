import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(private dialog: MatDialog) {}

  show(component: ComponentType<unknown>): Promise<boolean> {
    return new Promise(() => {
      this.dialog.open(component);
    });
  }
}
