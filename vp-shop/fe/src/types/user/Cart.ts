export type ProductShort = {
  id: number;
  name: string;
  price: string | number;
  image_url?: string;
};

export type CartItem = {
  id: number;
  quantity: number;
  product: ProductShort;
};