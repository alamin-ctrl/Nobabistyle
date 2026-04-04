export type Category = 'Men' | 'Women' | 'Kids' | 'Digital';

export interface Product {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  description: string;
  images: string[];
  category: Category;
  stock: number;
  isDigital: boolean;
  rating: number;
  reviews: number;
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Cotton Panjabi',
    price: 2500,
    discountPrice: 1999,
    description: 'High-quality cotton panjabi perfect for festive occasions. Comfortable and stylish.',
    images: ['https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&q=80&w=800'],
    category: 'Men',
    stock: 50,
    isDigital: false,
    rating: 4.8,
    reviews: 124,
  },
  {
    id: '2',
    name: 'Designer Silk Saree',
    price: 5500,
    discountPrice: 4800,
    description: 'Elegant silk saree with intricate embroidery work. Ideal for weddings and parties.',
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800'],
    category: 'Women',
    stock: 20,
    isDigital: false,
    rating: 4.9,
    reviews: 89,
  },
  {
    id: '3',
    name: 'Kids Denim Jacket',
    price: 1200,
    description: 'Stylish and durable denim jacket for kids. Perfect for winter.',
    images: ['https://images.unsplash.com/photo-1519241047957-be31d7379a5d?auto=format&fit=crop&q=80&w=800'],
    category: 'Kids',
    stock: 35,
    isDigital: false,
    rating: 4.5,
    reviews: 45,
  },
  {
    id: '4',
    name: 'Modern Web UI Kit (Figma)',
    price: 1500,
    discountPrice: 999,
    description: 'Complete UI kit for modern web applications. Includes 100+ components and 10+ pages.',
    images: ['https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=800'],
    category: 'Digital',
    stock: 999,
    isDigital: true,
    rating: 5.0,
    reviews: 210,
  },
  {
    id: '5',
    name: 'Casual T-Shirt Pack (3)',
    price: 1000,
    description: 'Pack of 3 comfortable cotton t-shirts for everyday wear.',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800'],
    category: 'Men',
    stock: 100,
    isDigital: false,
    rating: 4.2,
    reviews: 56,
  },
  {
    id: '6',
    name: 'Social Media Templates',
    price: 500,
    description: '50+ customizable social media templates for Instagram and Facebook.',
    images: ['https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800'],
    category: 'Digital',
    stock: 999,
    isDigital: true,
    rating: 4.7,
    reviews: 132,
  }
];
