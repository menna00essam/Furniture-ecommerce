import { Injectable } from '@angular/core';
import { user } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user: user = {
    id: '1',
    username: 'kamilia',
    email: 'kamiliaahmed01@gmail.com',
    favorites: [],
    cart: [],
  };

  getUser(): user {
    return this.user;
  }
}
