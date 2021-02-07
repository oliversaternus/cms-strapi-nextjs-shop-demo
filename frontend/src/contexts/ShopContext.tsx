import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { randomHex } from '../tools/Utils';
import { Product, CartItem, ShopConfig, Currency } from '../tools/Models';

const validateCartItems = (cartItems: CartItem[]) => {
    if (!Array.isArray(cartItems)) {
        return false;
    }
    try {
        for (const item of cartItems) {
            if (!item.id || !item.product || isNaN(item.quantity)) {
                return false;
            }
        }
        return true;
    } catch (e) {
        return false;
    }
};

export const ShopContext = React.createContext<{
    items: CartItem[];
    totalPrice: number;
    totalQuantity: number;
    maxQuantity: number;
    shippingPrice: number;
    shippingCountry: string;
    availibleShippingCountries: string[];
    checkoutMessage?: string;
    shippingInfo?: string;
    shopCurrency?: Currency;
    addToCart: (product: Product) => boolean;
    removeFromCart: (cartId: string) => void;
    setQuantity: (cartId: string, quantity: number) => boolean;
    setShippingCountry: (country: string) => void;
}>(
    {
        items: [],
        totalPrice: 0,
        totalQuantity: 0,
        maxQuantity: 10,
        shippingPrice: 0,
        shippingCountry: '',
        availibleShippingCountries: [],
        addToCart: () => true,
        removeFromCart: () => undefined,
        setQuantity: () => true,
        setShippingCountry: () => undefined
    });

export const ShopContextProvider: React.FC<{ config: ShopConfig }> = ({ children, config }) => {

    const availibleShippingCountries = useMemo(() => {
        let countries: string[] = [];
        for (const category of (config.shipping || [])) {
            countries = [...countries, ...(category.countries || [])];
        }
        return countries;
    }, [config]);

    const [items, setItems] = useState<CartItem[]>([]);
    const [shippingCountry, setshippingCountry] = useState(availibleShippingCountries[0] || 'DE');

    const maxQuantity = useMemo(() => config.maxQuantity || 10, [config, config.maxQuantity]);

    const shippingPrice = useMemo(() => {
        const foundIndex = config.shipping?.findIndex(shippingItem => shippingItem.countries.includes(shippingCountry));
        if (foundIndex !== undefined && foundIndex !== -1) {
            return config.shipping?.[foundIndex].price || 0;
        }
        return 0;
    }, [config, shippingCountry]);

    const loadItems = useCallback<() => CartItem[] | undefined>(() => {
        if (window && window.localStorage) {
            let _items = undefined;
            try {
                _items = JSON.parse(window.localStorage.getItem('cart') || '');
            } catch (e) {
                _items = undefined;
            }
            if (validateCartItems(_items)) {
                return _items;
            }
        }
    }, []);

    const saveItems = useCallback((_items) => {
        if (window && window.localStorage) {
            window.localStorage.setItem('cart', JSON.stringify(_items));
        }
    }, []);

    const totalPrice = useMemo(() => {
        let sum = 0;
        for (const item of items) {
            sum += (item.product?.price || 0) * item.quantity;
        }
        return sum;
    }, [items]);

    const totalQuantity = useMemo(() => {
        let sum = 0;
        for (const item of items) {
            sum += (item.quantity || 0);
        }
        return sum;
    }, [items]);

    const setQuantity = useCallback((cartId: string, quantity: number) => {
        const _items = loadItems() || [...items];
        const foundIndex = _items.findIndex((item) => item.id === cartId);
        if (foundIndex !== -1) {
            if (quantity > maxQuantity) {
                return false;
            }
            _items[foundIndex].quantity = quantity;
            saveItems(_items);
            setItems(_items);
            return true;
        }
        return false;
    }, [items]);

    const addToCart = useCallback((product: Product) => {
        const _items = loadItems() || [...items];
        const foundIndex = _items.findIndex((item) => item.product.id === product.id);
        if (foundIndex !== -1) {
            if (_items[foundIndex].quantity >= maxQuantity) {
                return false;
            }
            _items[foundIndex].quantity += 1;
            saveItems(_items);
            setItems(_items);
            return true;
        }
        const cartItem: CartItem = {
            id: randomHex(12),
            product,
            quantity: 1
        };
        _items.push(cartItem);
        saveItems(_items);
        setItems(_items);
        return true;
    }, [items]);

    const removeFromCart = useCallback((cartId: string) => {
        const _items = loadItems() || [...items];
        const foundIndex = _items.findIndex((item) => item.id === cartId);
        if (foundIndex !== -1) {
            _items.splice(foundIndex, 1);
            saveItems(_items);
            setItems(_items);
        }
    }, [items]);

    const setShippingCountry = useCallback<(country: string) => void>((country) => {
        setshippingCountry(country);
    }, []);

    useEffect(
        () => {
            const _items = loadItems() || [];
            setItems(_items);
        }, []
    );

    return (
        <ShopContext.Provider value={{
            items,
            totalPrice,
            totalQuantity,
            addToCart,
            removeFromCart,
            setQuantity,
            shippingCountry,
            setShippingCountry,
            availibleShippingCountries,
            maxQuantity,
            shippingPrice,
            checkoutMessage: config.checkoutMessage,
            shippingInfo: config.shippingInfo,
            shopCurrency: config.currency
        }}>
            {children}
        </ShopContext.Provider>
    );
}