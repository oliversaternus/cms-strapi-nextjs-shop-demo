import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { randomHex } from '../tools/Utils';
import { Product, CartItem } from '../tools/Models';

export const CartContext = React.createContext<{
    items: CartItem[];
    totalPrice: number;
    addToCart: (product: Product) => void;
    removeFromCart: (cartId: string) => void;
    setQuantity: (cartId: string, quantity: number) => void;
}>(
    {
        items: [],
        totalPrice: 0,
        addToCart: () => undefined,
        removeFromCart: () => undefined,
        setQuantity: () => undefined
    });

export const CartContextProvider: React.FC<{}> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    const totalPrice = useMemo(() => 0, [items]);

    const setQuantity = useCallback((cartId: string, quantity: number) => {
        const updated = [...items];
        const foundIndex = updated.findIndex((item) => item.id === cartId);
        if (foundIndex !== -1) {
            updated[foundIndex].quantity = quantity;
            setItems([...updated]);
        }
    }, [items]);

    const addToCart = useCallback((product: Product) => {
        const id = randomHex(12);
        const foundIndex = items.findIndex((item) => item.product?.id === product.id);
        if (foundIndex !== -1) {
            setQuantity(items[foundIndex].id, items[foundIndex].quantity + 1);
            return;
        }
        const cartItem: CartItem = {
            id,
            product,
            quantity: 1
        };
        setItems([...items, cartItem]);
    }, [items]);

    const removeFromCart = (cartId: string) => {

    };

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