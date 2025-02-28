import { Injectable } from '@angular/core';
import { product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products: product[] = [
    {
      id: 1,
      img: '/images/product.png',
      title: 'Syltherine',
      description: 'Stylish cafe chair',
      price: 2500000,
      sale: 20,
    },
    {
      id: 2,
      img: '/images/product.png',
      title: 'Syltherine',
      description: 'Stylish cafe chair',
      price: 2500000,
    },
    {
      id: 3,
      img: '/images/product.png',
      title: 'Syltherine',
      description: 'Stylish cafe chair',
      price: 2500000,
    },
    {
      id: 4,
      img: '/images/product.png',
      title: 'Syltherine',
      description: 'Stylish cafe chair',
      price: 2500000,
      sale: 20,
    },
    {
      id: 5,
      img: '/images/product.png',
      title: 'Syltherine',
      description: 'Stylish cafe chair',
      price: 2500000,
    },
    {
      id: 6,
      img: '/images/product.png',
      title: 'Syltherine',
      description: 'Stylish cafe chair',
      price: 2500000,
    },
    {
      id: 7,
      img: '/images/product.png',
      title: 'Syltherine',
      description: 'Stylish cafe chair',
      price: 2500000,
    },
    {
      id: 8,
      img: '/images/product.png',
      title: 'Syltherine',
      description: 'Stylish cafe chair',
      price: 2500000,
    },
  ];

  getProductNames(): string[] {
    return this.products.map((p) => p.title);
  }
  getProducts(): product[] {
    return this.products;
  }
}
