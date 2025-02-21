import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogPost } from '../../models/blog-post';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-blog',
  imports: [CommonModule,],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent {
  post?: BlogPost;
  posts: BlogPost[] = [

    {
      id: 1,
      title: 'Transform Your Living Room with Elegant Furniture',
      excerpt: 'Discover how to refresh your living space with stylish and comfortable furniture choices.',
      content: "Are you tired of the same old living room setup, longing for a refreshing change? It's time to embark on a journey of transformation with our meticulously curated selection of stylish furniture. We understand the importance of creating a living space that not only exudes comfort but also captivates with its aesthetic allure.",
      image: '/images/desgin1.jpg',
      category: 'Furniture & Decor',
      date: '2024-02-18',
      users:'InteriorDesignPro',

    },
    {
      id: 2,
      title: 'Dining Room Makeover: The Perfect Table & Chairs',
      excerpt: 'Your dining space is more than just a place to eat; it’s a hub for connection and style. Learn how to choose the perfect furniture.',
      content: "The dining room is a multifaceted space that serves various purposes beyond just a place to eat; it’s a central hub for gathering, entertaining, and creating enduring memories. Selecting the right dining furniture is paramount to elevating this experience.",
      image: '/images/desgin2.jpg',
      category: 'Furniture & Decor',
      date: '2024-02-17' ,
      users:'InteriorDesignPro',
    },
    {
      id: 3,
      title: 'Bedroom Bliss: Designing a Cozy and Stylish Retreat',
      excerpt: 'Your bedroom should be a sanctuary of comfort and relaxation. Explore tips for selecting the right furniture and decor.',
      content: "Your bedroom should be the most relaxing space in your home, offering a perfect blend of comfort and style. From selecting the right bed frame to choosing soothing color palettes, every detail contributes to a serene and inviting atmosphere.",
      image: '/images/desgin3.jpg',
      category: 'Furniture & Decor',
      date: '2024-02-16',
      users:'DiningRoomGuru',
    },
    {
      id: 4,
      title: 'The Magic of Lighting: Enhance Your Home Ambience',
      excerpt: 'Lighting can transform your space. Learn how to use floor lamps, pendant lights, and smart lighting solutions to set the mood.',
      content: "Lighting plays a crucial role in home decor, shaping the ambiance and functionality of each room. Whether it’s warm-toned pendant lights for the living room or task lighting for the workspace, the right choices can elevate your home’s atmosphere.",
      image: './images/desgin4.jpg',
      category: 'Furniture' ,
      date: '2024-02-16',
      users:'SleepWellDesigner',
    },
    {
      id: 5,
      title: 'The Magic of Lighting: Enhance Your Home Ambience',
      excerpt: 'Lighting can transform your space. Learn how to use floor lamps, pendant lights, and smart lighting solutions to set the mood.',
      content: "Lighting plays a crucial role in home decor, shaping the ambiance and functionality of each room. Whether it’s warm-toned pendant lights for the living room or task lighting for the workspace, the right choices can elevate your home’s atmosphere.",
      image: './images/carfts1.jpg',
      category: 'office' ,
      date: '2024-02-16',
      users:'SleepWellDesigner',
    },
    {
      id: 6,
      title: 'The Magic of Lighting: Enhance Your Home Ambience',
      excerpt: 'Lighting can transform your space. Learn how to use floor lamps, pendant lights, and smart lighting solutions to set the mood.',
      content: "Lighting plays a crucial role in home decor, shaping the ambiance and functionality of each room. Whether it’s warm-toned pendant lights for the living room or task lighting for the workspace, the right choices can elevate your home’s atmosphere.",
      image: './images/carfts2.jpg',
      category: 'office' ,
      date: '2024-02-16',
      users:'SleepWellDesigner',
    },
    {
      id: 7,
      title: 'The Magic of Lighting: Enhance Your Home Ambience',
      excerpt: 'Lighting can transform your space. Learn how to use floor lamps, pendant lights, and smart lighting solutions to set the mood.',
      content: "Lighting plays a crucial role in home decor, shaping the ambiance and functionality of each room. Whether it’s warm-toned pendant lights for the living room or task lighting for the workspace, the right choices can elevate your home’s atmosphere.",
      image: './images/carfts3.jpg',
      category: 'office' ,
      date: '2024-02-16',
      users:'SleepWellDesigner',
    },
    {
      id: 8,
      title: 'The Magic of Lighting: Enhance Your Home Ambience',
      excerpt: 'Lighting can transform your space. Learn how to use floor lamps, pendant lights, and smart lighting solutions to set the mood.',
      content: "Lighting plays a crucial role in home decor, shaping the ambiance and functionality of each room. Whether it’s warm-toned pendant lights for the living room or task lighting for the workspace, the right choices can elevate your home’s atmosphere.",
      image: './images/carft4.jpg',
      category: 'smart home' ,
      date: '2024-02-16',
      users:'SleepWellDesigner',
    },
    {
      id: 9,
      title: 'The Magic of Lighting: Enhance Your Home Ambience',
      excerpt: 'Lighting can transform your space. Learn how to use floor lamps, pendant lights, and smart lighting solutions to set the mood.',
      content: "Lighting plays a crucial role in home decor, shaping the ambiance and functionality of each room. Whether it’s warm-toned pendant lights for the living room or task lighting for the workspace, the right choices can elevate your home’s atmosphere.",
      image: './images/carfts2.jpg',
      category: 'smart home' ,
      date: '2024-02-16',
      users:'SleepWellDesigner',
    },

  ];
  selectedCategory: string = '';
  postId: number  | null = null ;
  constructor(private readonly route: ActivatedRoute ,
    private readonly router: Router
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.postId = idParam ? Number(idParam) : null;

    if (this.postId !== null) {
      this.post = this.posts.find(post => post.id === this.postId);
      if (this.post) {
        this.selectedCategory = this.post.category;
      }
    }
  }
  navigateToPost(postId: number) {
    this.router.navigate(['/post', postId]);
  }

  get relatedPosts(): BlogPost[] {
    return this.posts.filter(post => post.category === this.selectedCategory && post.id !== this.postId);
  }

};


