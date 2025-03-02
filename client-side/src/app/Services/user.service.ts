import { Injectable } from '@angular/core';
import { user } from '../Models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user: user = { id: 1, favorites: [], cart: [] };

  getUser(userId: number): user {
    return this.user;
  }
}
