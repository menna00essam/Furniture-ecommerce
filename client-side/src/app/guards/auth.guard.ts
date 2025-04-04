import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  console.log('Auth Guard activated');
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuthenticated()) {
    console.log('User is authenticated');
    return true;
  }
  router.navigate(['/']);
  console.log('User is not authenticated');
  return false;
};
