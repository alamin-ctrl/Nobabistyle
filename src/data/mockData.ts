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
    name: 'Royal Silk Panjabi',
    price: 4500,
    discountPrice: 3999,
    description: 'Exquisite silk panjabi with intricate hand embroidery. Perfect for weddings and festive occasions.',
    images: ['https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&q=80&w=800'],
    category: 'Men',
    stock: 50,
    isDigital: false,
    rating: 4.9,
    reviews: 124,
  },
  {
    id: '2',
    name: 'Banarasi Silk Saree',
    price: 12500,
    discountPrice: 10800,
    description: 'Authentic Banarasi silk saree with golden zari work. A masterpiece for your special day.',
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800'],
    category: 'Women',
    stock: 15,
    isDigital: false,
    rating: 5.0,
    reviews: 89,
  },
  {
    id: '3',
    name: 'Premium Velvet Sherwani',
    price: 25000,
    description: 'Luxurious velvet sherwani featuring zardosi embroidery. The ultimate groom collection.',
    images: ['https://images.unsplash.com/photo-1583391733958-d15070012812?auto=format&fit=crop&q=80&w=800'],
    category: 'Men',
    stock: 10,
    isDigital: false,
    rating: 4.8,
    reviews: 45,
  },
  {
    id: '4',
    name: 'Designer Bridal Lehenga',
    price: 35000,
    discountPrice: 32000,
    description: 'Heavy bridal lehenga with intricate stone and thread work. Make your wedding day unforgettable.',
    images: ['https://images.unsplash.com/photo-1583391733975-6614b640b3e4?auto=format&fit=crop&q=80&w=800'],
    category: 'Women',
    stock: 5,
    isDigital: false,
    rating: 4.9,
    reviews: 210,
  },
  {
    id: '5',
    name: 'Kids Festive Kurta Set',
    price: 2200,
    description: 'Comfortable and stylish cotton kurta set for kids. Perfect for family gatherings.',
    images: ['https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&q=80&w=800'],
    category: 'Kids',
    stock: 30,
    isDigital: false,
    rating: 4.7,
    reviews: 56,
  },
  {
    id: '6',
    name: 'Nobabi Digital Gift Card',
    price: 5000,
    description: 'The perfect gift of choice. Valid for all premium collections at Nobabi Style.',
    images: ['https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&q=80&w=800'],
    category: 'Digital',
    stock: 999,
    isDigital: true,
    rating: 5.0,
    reviews: 132,
  },
  {
    id: '7',
    name: 'Classic Cotton Salwar Kameez',
    price: 3500,
    discountPrice: 2999,
    description: 'Elegant everyday wear with subtle embroidery. Breathable fabric for all-day comfort.',
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800'],
    category: 'Women',
    stock: 45,
    isDigital: false,
    rating: 4.6,
    reviews: 78,
  },
  {
    id: '8',
    name: 'Exclusive Style Guide 2026',
    price: 1500,
    discountPrice: 999,
    description: 'Digital magazine featuring the latest trends, styling tips, and exclusive interviews.',
    images: ['https://images.unsplash.com/photo-1586882829491-b81178aa622e?auto=format&fit=crop&q=80&w=800'],
    category: 'Digital',
    stock: 999,
    isDigital: true,
    rating: 4.8,
    reviews: 95,
  }
];
