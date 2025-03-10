import { product } from './product.model';

export interface user {
  id: string;
  username: string;
  email: string;
  favorites: product[];
  cart: product[];
}
