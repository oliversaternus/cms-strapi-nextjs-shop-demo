import { Currency } from './Models';

export const shallowMerge: <T>(input: { [key: string]: any }, mergeObject: { [key: string]: any }) => void = (input, mergeObject) => {
    if (typeof input !== 'object') {
        return input;
    }

    for (const key of Object.keys(mergeObject)) {
        input[key] = mergeObject[key];
    }
};

export const randomHex = (size: number) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

export const formatCurrency = (amount?: number, currency?: Currency) => {
    if (!amount || !currency) {
        return undefined;
    }
    let currencySymbol = '';
    switch (currency) {
        case 'Dollar':
            currencySymbol = '$';
            break;
        case 'Euro':
            currencySymbol = '€';
            break;
        case 'Pound':
            currencySymbol = '£';
            break;
        case 'Yen':
            currencySymbol = '¥';
            break;
    }
    return `${amount.toFixed(2)} ${currencySymbol}`;
};