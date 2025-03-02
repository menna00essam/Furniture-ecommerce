import { product } from './product.model';

export interface user {
  id: number;
  favorites: product[];
  cart: product[];
}
