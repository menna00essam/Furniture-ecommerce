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
import { ComparisonComponent } from './Components/comparison/comparison.component';
import { SignupComponent } from './Components/registration/signup/signup.component';
import { LoginComponent } from './Components/registration/login/login.component';
import { FavoritesComponent } from './Components/favorites/favorites.component';
import { ForgotPasswordComponent } from './Components/registration/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './Components/registration/reset-password/reset-password.component';
import { AdminComponent } from './Components/admin/admin.component';
import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'register',
    component: RegistrationComponent,
    children: [
      { path: '', component: LoginComponent, canActivate: [authGuard] },
      { path: 'login', component: LoginComponent, canActivate: [authGuard] },
      { path: 'signup', component: SignupComponent, canActivate: [authGuard] },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: '**', component: NotFoundComponent },
    ],
  },
  {
    path: '',
    component: RootComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
      { path: 'home', component: HomeComponent },
      { path: 'shop', component: ShopComponent },
      { path: 'product/:id', component: ProductComponent },
      { path: 'cart', component: CartComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'blogs', component: BlogsComponent },
      { path: 'blog/:id', component: BlogComponent },
      { path: 'comparison', component: ComparisonComponent },

      { path: 'favorites', component: FavoritesComponent },

      { path: '**', component: NotFoundComponent },
    ],
  },
];
