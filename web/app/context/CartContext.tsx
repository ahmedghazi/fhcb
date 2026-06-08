"use client";
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

const STORAGE_KEY = "fhcb_cart";

export type CartLineItem = {
  id: string;
  title: string;
  price: number;
  image?: string;
  href?: string;
  quantity: number;
};

type ContextProps = {
  items: CartLineItem[];
  isOpen: boolean;
  addToCart: (item: Omit<CartLineItem, "quantity">, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  cartCount: number;
  cartTotal: number;
};

const CartContext = createContext<ContextProps>({} as ContextProps);

export const CartContextProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartLineItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // ignore malformed storage
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore storage errors (e.g. private browsing)
    }
  }, [items]);

  const addToCart = useCallback(
    (item: Omit<CartLineItem, "quantity">, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((line) => line.id === item.id);
        if (existing) {
          return prev.map((line) =>
            line.id === item.id
              ? { ...line, quantity: line.quantity + quantity }
              : line,
          );
        }
        return [...prev, { ...item, quantity }];
      });
      setIsOpen(true);
    },
    [],
  );

  const removeFromCart = useCallback((id: string) => {
    setItems((prev) => prev.filter((line) => line.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((line) => (line.id === id ? { ...line, quantity } : line)),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  const cartCount = useMemo(
    () => items.reduce((sum, line) => sum + line.quantity, 0),
    [items],
  );
  const cartTotal = useMemo(
    () => items.reduce((sum, line) => sum + line.price * line.quantity, 0),
    [items],
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        toggleCart,
        cartCount,
        cartTotal,
      }}>
      {children}
    </CartContext.Provider>
  );
};

export default function useCart() {
  return useContext(CartContext);
}
