import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../shared/button/button.component';
import { product } from '../../models/product.model';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-header',
  imports: [RouterModule, CurrencyPipe, CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  isActive = false;
  favModalShow = false;
  cartModalShow = false;
  searchShow = false;
  searchValue = '';
  productsNames: string[] = [];
  searchValues: string[] = [];
  favorites: product[] = [
    {
      id: 1,
      img: '/images/product.png',
      title: 'Syltherine',
      discription: 'Stylish cafe chair',
      price: 2500000,
      sale: 20,
    },
  ];
  cart: product[] = [
    {
      id: 1,
      img: '/images/product.png',
      title: 'Syltherine',
      discription: 'Stylish cafe chair',
      price: 2500000,
      sale: 20,
    },
  ];

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
  cartProductsTotalPrice = 0;
  constructor() {
    this.cartProductsTotalPrice = this.cart.reduce(
      (total, i) => total + i.price,
      0
    );
    this.productsNames = this.products.map((p) => p.title);
  }

  toggleMenu() {
    this.isActive = !this.isActive;
  }
  toggleFavModal(open: boolean) {
    this.favModalShow = open;
    if (open) {
      document.body.style.overflowY = 'hidden';
      document.body.style.width = 'calc(100% - 10px)';
    } else {
      document.body.style.overflowY = 'auto';
      document.body.style.width = '';
    }
  }
  toggleCartModal(open: boolean) {
    this.cartModalShow = open;
    if (open) {
      document.body.style.overflowY = 'hidden';
      document.body.style.width = 'calc(100% - 10px)';
    } else {
      document.body.style.overflowY = 'auto';
      document.body.style.width = '';
    }
  }
  deletefavorites(id: number) {
    this.favorites = this.favorites.filter((fav) => fav.id != id);
  }
  deleteCartProduct(id: number) {
    this.cart = this.cart.filter((fav) => fav.id != id);
    this.cartProductsTotalPrice = this.cart.reduce(
      (total, i) => total + i.price,
      0
    );
  }
  toggleSearch(open: boolean) {
    this.searchShow = open;
  }

  updateSearch() {
    this.searchValues = this.productsNames.filter((p) =>
      p.toLowerCase().includes(this.searchValue.toLowerCase())
    );
  }
}
