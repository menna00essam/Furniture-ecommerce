import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  NavigationEnd,
  RouterModule,
} from '@angular/router';
import { BlogPost } from '../../Models/blog.model';
import { BlogService } from '../../Services/blog.service';
import { CommonModule } from '@angular/common';
import { HeaderBannerComponent } from '../shared/header-banner/header-banner.component';
import { FeatureBannerComponent } from '../shared/feature-banner/feature-banner.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderBannerComponent,
    FeatureBannerComponent,
  ],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
})
export class BlogComponent implements OnInit, OnDestroy {
  blogs: BlogPost[] = [];
  blog: BlogPost | undefined;
  relatedBlogs: BlogPost[] = [];
  selectedCategory: string = '';
  private routeSub: Subscription = new Subscription();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly blogService: BlogService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.routeSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const blogID = this.route.snapshot.paramMap.get('id');
        if (blogID) {
          this.fetchBlogData(blogID);
        }
      }
    });

    // Initial fetch for the current blog (if needed)
    const blogID = this.route.snapshot.paramMap.get('id');
    if (blogID) {
      this.fetchBlogData(blogID);
    }
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  fetchBlogData(blogID: string): void {
    this.blogService.getPostById(blogID).subscribe((data) => {
      console.log('[BlogComponent] Blog data:', data);
      this.blog = data;
      this.blogService.getRelatedPosts(blogID).subscribe((relatedData) => {
        this.relatedBlogs = relatedData;
      });
    });
  }

  get blogID(): string | null {
    return this.route.snapshot.paramMap.get('id');
  }

  get relatedBlogsList(): BlogPost[] {
    return this.relatedBlogs;
  }
}
