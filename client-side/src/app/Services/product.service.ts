import { Injectable } from '@angular/core';
import { product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products: product[] = [
    {
      id: 1,
      img: '/images/products/1.png',
      title: 'Syltherine',
      description: 'Stylish cafe chair',
      price: 2500000,
      sale: 20,
    },
    {
      id: 2,
      img: '/images/products/2.png',
      title: 'Syltherine',
      description: 'Stylish cafe chair',
      price: 2500000,
    },
    {
      id: 3,
      img: '/images/products/3.png',
      title: 'Syltherine',
      description: 'Stylish cafe chair',
      price: 2500000,
    },
    {
      id: 4,
      img: '/images/products/4.png',
      title: 'Syltherine',
      description: 'Stylish cafe chair',
      price: 2500000,
      sale: 20,
    },
    {
      id: 5,
      img: '/images/products/5.png',
      title: 'Syltherine',
      description: 'Stylish cafe chair',
      price: 2500000,
    },
    {
      id: 6,
      img: '/images/products/6.png',
      title: 'Syltherine',
      description: 'Stylish cafe chair',
      price: 2500000,
    },
    {
      id: 7,
      img: '/images/products/7.png',
      title: 'Syltherine',
      description: 'Stylish cafe chair',
      price: 2500000,
    },
    {
      id: 8,
      img: '/images/products/8.png',
      title: 'Syltherine',
      description: 'Stylish cafe chair',
      price: 2500000,
    },
    {
      id: 9,
      img: '/images/products/9.png',
      title: 'Syltherine',
      description: 'Stylish cafe chair',
      price: 2500000,
    },

    {
      id: 10,
      img: '/images/products/10.png',
      title: 'Syltherine',
      description: 'Stylish cafe chair',
      price: 2500000,
    },
    {
      id: 11,
      img: '/images/products/11.png',
      title: 'Syltherine',
      description: 'Stylish cafe chair',
      price: 2500000,
    },
    {
      id: 12,
      img: '/images/products/12.png',
      title: 'Syltherine',
      description: 'Stylish cafe chair',
      price: 2500000,
    },
    {
      id: 13,
      img: '/images/products/13.png',
      title: 'Syltherine',
      description: 'Stylish cafe chair',
      price: 2500000,
    },
    {
      id: 14,
      img: '/images/products/14.png',
      title: 'Syltherine',
      description: 'Stylish cafe chair',
      price: 2500000,
    },
    {
      id: 15,
      img: '/images/products/15.png',
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
