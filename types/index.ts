export type Locale = 'fr' | 'en';

export type Category = 'femme' | 'parfums' | 'bijoux' | 'homme';

export interface Product {
  id: string;
  slug: string;
  nameFr: string;
  nameEn: string;
  descriptionFr: string;
  descriptionEn: string;
  price: number;
  currency: string;
  category: Category;
  subcategory?: string;
  images: string[];
  stock: number;
  sizes?: string[];
  colors?: string[];
  featured: boolean;
  active: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}
