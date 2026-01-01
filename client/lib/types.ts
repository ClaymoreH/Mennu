export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Restaurant {
  id: string;
  name: string;
  logo: string;
  tagline: string;
  whatsappNumber: string;
  description: string;
  address: string;
}
