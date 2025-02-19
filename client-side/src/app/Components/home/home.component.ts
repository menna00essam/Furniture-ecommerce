import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import Swiper from 'swiper';
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from 'swiper/modules';

import { CommonModule, UpperCasePipe } from '@angular/common';
import { ButtonComponent } from '../../shared/button/button.component';
import { ProductItemComponent } from '../../shared/product-item/product-item.component';
import { product } from '../../models/product.model';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-home',
  imports: [
    ButtonComponent,
    UpperCasePipe,
    ProductItemComponent,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements AfterViewInit {
  constructor(private router: Router) {}
  @ViewChild('swiperRef', { static: false }) swiperRef!: ElementRef;
  @ViewChild('imageSwiper', { static: false }) imageSwiper!: ElementRef;
  @ViewChild('imageSwiper2', { static: false }) imageSwiper2!: ElementRef;

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
  ngAfterViewInit() {
    new Swiper(this.swiperRef.nativeElement, {
      modules: [Navigation, EffectCoverflow, Pagination],
      effect: 'coverflow',
      centeredSlides: true,
      slidesPerView: 2,
      spaceBetween: 100,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      loop: true,
      coverflowEffect: {
        rotate: 40,
        stretch: 50,
        depth: 240,
        modifier: 1,
        slideShadows: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
    new Swiper(this.imageSwiper.nativeElement, {
      modules: [Pagination, Autoplay],
      slidesPerView: 5,
      spaceBetween: 20,
      grid: {
        rows: 1,
        fill: 'row',
      },
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      loop: true,
    });
    new Swiper(this.imageSwiper2.nativeElement, {
      modules: [Pagination, Autoplay],
      slidesPerView: 5,
      spaceBetween: 20,
      effect: 'slide',
      grid: {
        rows: 1,
        fill: 'row',
      },
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
        reverseDirection: true,
      },
      loop: true,
    });
  }
}
