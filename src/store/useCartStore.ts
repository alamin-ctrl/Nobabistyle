import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../data/mockData';

export interface CartItem extends Product {
  cartItemId: string; // Add a unique ID for cart items to handle variants
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, selectedSize?: string, selectedColor?: string) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1, selectedSize, selectedColor) => {
        set((state) => {
          const cartItemId = `${product.id}-${selectedSize || 'none'}-${selectedColor || 'none'}`;
          const existingItem = state.items.find((item) => item.cartItemId === cartItemId);
          
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.cartItemId === cartItemId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return { items: [...state.items, { ...product, cartItemId, quantity, selectedSize, selectedColor }] };
        });
      },
      removeItem: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.cartItemId !== cartItemId),
        }));
      },
      updateQuantity: (cartItemId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.cartItemId === cartItemId ? { ...item, quantity } : item
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      totalPrice: () => {
        return get().items.reduce(
          (total, item) => total + (item.discountPrice || item.price) * item.quantity,
          0
        );
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
