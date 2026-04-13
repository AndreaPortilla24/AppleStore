import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = (product, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.idProducto === product.idProducto);
      if (existing) {
        return prev.map(i =>
          i.idProducto === product.idProducto
            ? { ...i, cantidad: Math.min(i.cantidad + qty, product.invDisponible) }
            : i
        );
      }
      return [...prev, { ...product, cantidad: qty }];
    });
    setIsOpen(true);
  };

  const removeItem = (id) => setItems(prev => prev.filter(i => i.idProducto !== id));

  const updateQty = (id, qty) => {
    if (qty <= 0) { removeItem(id); return; }
    setItems(prev => prev.map(i => i.idProducto === id ? { ...i, cantidad: qty } : i));
  };

  const clear = () => setItems([]);

  const total = items.reduce((sum, i) => sum + Number(i.precio) * i.cantidad, 0);
  const count = items.reduce((sum, i) => sum + i.cantidad, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clear, total, count, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
