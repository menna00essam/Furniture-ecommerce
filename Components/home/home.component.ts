import { Component } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { ButtonComponent } from '../../shared/button/button.component';
import { ProductItemComponent } from '../../shared/product-item/product-item.component';
import { product } from '../../models/product.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  imports: [ButtonComponent, UpperCasePipe, ProductItemComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(private router: Router) {}

  products: product[] = [
    {
      id: 1,
      img: '/images/product.png',
      title: 'Syltherine',
      discription: 'Stylish cafe chair',
      price: 2500000,
      sale: 20,
    },
    {
      id: 2,
      img: '/images/product.png',
      title: 'Syltherine',
      discription: 'Stylish cafe chair',
      price: 2500000,
    },
    {
      id: 3,
      img: '/images/product.png',
      title: 'Syltherine',
      discription: 'Stylish cafe chair',
      price: 2500000,
    },
    {
      id: 4,
      img: '/images/product.png',
      title: 'Syltherine',
      discription: 'Stylish cafe chair',
      price: 2500000,
      sale: 20,
    },
    {
      id: 5,
      img: '/images/product.png',
      title: 'Syltherine',
      discription: 'Stylish cafe chair',
      price: 2500000,
    },
    {
      id: 6,
      img: '/images/product.png',
      title: 'Syltherine',
      discription: 'Stylish cafe chair',
      price: 2500000,
    },
    {
      id: 7,
      img: '/images/product.png',
      title: 'Syltherine',
      discription: 'Stylish cafe chair',
      price: 2500000,
    },
    {
      id: 8,
      img: '/images/product.png',
      title: 'Syltherine',
      discription: 'Stylish cafe chair',
      price: 2500000,
    },
  ];
}
