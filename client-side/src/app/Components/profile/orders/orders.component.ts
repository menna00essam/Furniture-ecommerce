import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../Services/order.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownComponent } from '../../shared/dropdown/dropdown.component';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

interface Order {
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  imports: [CommonModule, FormsModule, DropdownComponent],
})
export class OrdersComponent implements OnInit {
  orders$!: Observable<Order[]>;
  totalOrders$!: Observable<number>;
  totalPages$!: Observable<number>;

  itemsPerPage$ = new BehaviorSubject<number>(10);
  pageSizes = ['10', '20', '50', '100'];
  currentPage = 1;
  pageSizesMenuOpen = false;

  pendingChecked = false;
  succeededChecked = false;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orders$ = this.orderService.orders$;
    this.totalOrders$ = this.orderService.totalOrders$;

    // 🔹 Make totalPages$ reactive
    this.totalPages$ = combineLatest([
      this.totalOrders$,
      this.itemsPerPage$,
    ]).pipe(
      map(([totalOrders, itemsPerPage]) =>
        Math.max(1, Math.ceil(totalOrders / itemsPerPage))
      )
    );

    this.fetchOrders();
  }

  fetchOrders(): void {
    this.orderService.getOrders(this.itemsPerPage$.value, this.currentPage);
  }

  updatePageSize(pageSize: { id: string; value: string }): void {
    this.itemsPerPage$.next(+pageSize.value);
    this.currentPage = 1;
    this.pageSizesMenuOpen = false;
    this.fetchOrders();
  }

  goToPage(page: number): void {
    this.totalPages$.subscribe((totalPages) => {
      if (page >= 1 && page <= totalPages) {
        this.currentPage = page;
        this.fetchOrders();
      }
    });
  }

  goToFirstPage(): void {
    this.goToPage(1);
  }
  goToPreviousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  goToNextPage(): void {
    this.goToPage(this.currentPage + 1);
  }
  goToLastPage(): void {
    this.totalPages$.subscribe((totalPages) => this.goToPage(totalPages));
  }

  togglePageSizesMenuOpen(): void {
    this.pageSizesMenuOpen = !this.pageSizesMenuOpen;
  }
}
