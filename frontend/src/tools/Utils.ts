export const shallowMerge: <T>(input: { [key: string]: any }, mergeObject: { [key: string]: any }) => void = (input, mergeObject) => {
    if (typeof input !== 'object') {
        return input;
    }

    for (const key of Object.keys(mergeObject)) {
        input[key] = mergeObject[key];
    }
};

export const randomHex = (size: number) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

export const formatCurrency = (amount?: number) => amount ? new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount) : undefined;