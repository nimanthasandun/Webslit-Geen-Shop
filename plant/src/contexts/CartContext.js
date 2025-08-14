import React, { createContext, useState, useEffect } from 'react';
import { useUser } from './UserContext'; // import user context

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useUser(); // get current user

  useEffect(() => {
    // When user changes, clear the cart
    setCartItems([]);
  }, [user?.email]); // triggered when user email changes

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        const updatedQty = existing.quantity + product.quantity;

        if (updatedQty > product.stock) {
          alert(`Only ${product.stock - existing.quantity} item(s) left in stock.`);
          return prev;
        }

        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: updatedQty }
            : item
        );
      }

      if (product.quantity > product.stock) {
        alert(`Only ${product.stock} item(s) available in stock.`);
        return prev;
      }

      return [...prev, { ...product }];
    });
  };

  const updateQuantity = (id, newQuantity) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
