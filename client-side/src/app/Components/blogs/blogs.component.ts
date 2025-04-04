import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HeaderBannerComponent } from '../shared/header-banner/header-banner.component';
import { FeatureBannerComponent } from '../shared/feature-banner/feature-banner.component';
import { DropdownComponent } from '../shared/dropdown/dropdown.component';
import { PaginationComponent } from '../shared/pagination/pagination.component';

import { BlogService } from '../../Services/blog.service';
import { BlogPost } from '../../Models/blog.model';

import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-blogs',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HeaderBannerComponent,
    FeatureBannerComponent,
    DropdownComponent,
    PaginationComponent,
  ],
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css'],
})
export class BlogsComponent implements OnInit {
  @ViewChild('blogsContainer') blogsContainer!: ElementRef;

  categories: string[] = [];
  selectedCategory: string = 'All';
  isMenuOpen: boolean = false;
  searchQuery: string = '';
  posts$!: Observable<BlogPost[]>; // Now using an Observable

  currentPage: number = 1;
  postsPerPage: number = 3;
  totalPosts: number = 0;
  totalPages: number = 0;

  constructor(
    private readonly route: ActivatedRoute,
    private blogService: BlogService
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadPosts();
  }

  loadCategories() {
    this.blogService.getCategories();
    this.blogService.categories$.subscribe((data) => {
      this.categories = ['All', ...data];
    });
  }

  loadPosts() {
    // Fetch posts with the selected category, page, and posts per page
    this.blogService.getAllPosts(
      this.currentPage,
      this.postsPerPage,
      this.selectedCategory
    );

    // Subscribe to posts$ to get the posts list
    this.posts$ = this.blogService.posts$;

    // Subscribe to totalPosts$ to get the total count of posts
    this.blogService.totalPosts$.subscribe((totalPosts) => {
      this.totalPosts = totalPosts;
      // Calculate total pages based on totalPosts and postsPerPage
      this.totalPages = Math.ceil(this.totalPosts / this.postsPerPage);
      console.log('Total Pages:', this.totalPages);
    });

    // You can also subscribe to posts$ here if needed
    this.posts$.subscribe((posts) => {
      // Handle the posts array if you want to perform any operations on it
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadPosts();
    if (this.blogsContainer?.nativeElement) {
      const offset = 100;
      window.scrollTo({
        top:
          this.blogsContainer.nativeElement.getBoundingClientRect().top +
          window.scrollY -
          offset,
        behavior: 'smooth',
      });
    }
  }

  filterByCategory(selectedItem: { id: string; value: string } | string) {
    this.selectedCategory =
      typeof selectedItem === 'string' ? selectedItem : selectedItem.value;
    this.currentPage = 1; // Reset to the first page when category changes
    this.loadPosts(); // Fetch posts with the selected category
    this.toggleDropdown(false); // Close the dropdown after selection
  }

  toggleDropdown(open: boolean) {
    this.isMenuOpen = open;
  }
}
