export interface product {
  id: number;
  img: string;
  title: string;
  discription: string;
  price: number;
  category?: string;
  date?: string;
  sale?: number | false;
}
