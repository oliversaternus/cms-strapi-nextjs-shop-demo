import React, { useEffect, useState, useMemo } from 'react';
import { randomHex } from '../tools/Utils';
import { Product, CartItem } from '../tools/Models';

export const CartContext = React.createContext<{
    items: CartItem[];
    totalPrice: number;
    addToCart: (product: Product) => void;
    removeFromCart: (cartId: string) => void;
    setQuantity: (carftId: number, quantity: number) => void;
}>(
    {
        items: [],
        totalPrice: 0,
        addToCart: () => undefined,
        removeFromCart: () => undefined,
        setQuantity: () => undefined
    });

export const CartContextProvider: React.FC<{}> = ({ children }) => {
    const [items, setItems] = useState([]);

    const totalPrice = useMemo(() => 0, [items]);

    const addToCart = (product: Product) => {

    };

    const removeFromCart = (cartId: string) => {

    };

    const setQuantity = (cartId: number, quantity: number) => { };

    useEffect(
        () => {
            // initialize
        }, []
    );

    return (
        <CartContext.Provider value={{ items, totalPrice, addToCart, removeFromCart, setQuantity }}>
            {children}
        </CartContext.Provider>
    );
}