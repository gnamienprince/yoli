import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  addItem: (
    product: Product,
    quantity?: number,
    size?: string,
    color?: string
  ) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    size?: string,
    color?: string
  ) => void;
  clearCart: () => void;

  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  getTotalItems: () => number;
  getTotalPrice: () => number;
}

/**
 * Returns true when a stored line matches the given product/variant triple.
 * A cart line is uniquely identified by product id + size + color so that
 * the same product in two sizes stays on two separate lines.
 */
function isSameLine(
  item: CartItem,
  productId: string,
  size?: string,
  color?: string
): boolean {
  return (
    item.product.id === productId &&
    item.size === size &&
    item.color === color
  );
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1, size, color) =>
        set((state) => {
          const existing = state.items.find((item) =>
            isSameLine(item, product.id, size, color)
          );

          if (existing) {
            return {
              isOpen: true,
              items: state.items.map((item) =>
                isSameLine(item, product.id, size, color)
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return {
            isOpen: true,
            items: [...state.items, { product, quantity, size, color }],
          };
        }),

      removeItem: (productId, size, color) =>
        set((state) => ({
          items: state.items.filter(
            (item) => !isSameLine(item, productId, size, color)
          ),
        })),

      updateQuantity: (productId, quantity, size, color) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter(
                (item) => !isSameLine(item, productId, size, color)
              ),
            };
          }

          return {
            items: state.items.map((item) =>
              isSameLine(item, productId, size, color)
                ? { ...item, quantity }
                : item
            ),
          };
        }),

      clearCart: () => set({ items: [] }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        ),
    }),
    {
      name: 'yoli-cart',
      // Only the line items are persisted; drawer open state is per-session.
      partialize: (state) => ({ items: state.items }),
    }
  )
);
