export interface product {
  id: number;
  img: string;
  name: string;
  subTitle: string;
  price: number;
  category: string;
  date: Date;
  sale?: number | false;
  quantity: number;
}
