import { Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { RootComponent } from './Components/root/root.component';
import { RegistrationComponent } from './Components/registration/registration.component';
import { ShopComponent } from './Components/shop/shop.component';
import { ProductComponent } from './Components/product/product.component';
import { CartComponent } from './Components/cart/cart.component';
import { CheckoutComponent } from './Components/checkout/checkout.component';
import { ContactComponent } from './Components/contact/contact.component';
import { BlogsComponent } from './Components/blogs/blogs.component';
import { BlogComponent } from './Components/blog/blog.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: RootComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'home', component: HomeComponent },
      { path: 'shop', component: ShopComponent },
      { path: 'product', component: ProductComponent },
      { path: 'cart', component: CartComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'blogs', component: BlogsComponent },
      { path: 'blog/:id', component: BlogComponent },

      { path: '**', component: NotFoundComponent },
    ],
  },
  {
    path: 'register',
    component: RegistrationComponent,
  },
];
