import { Post, PostQuery, Response, Page, Message, GlobalData, Integrations, CookieConfig, Product, ProductQuery, ShopConfig, Order } from './Models';
import { stringify } from 'qs';

export const apiBaseUrl = 'http://localhost:1337';

const invokeApi = async <T>(path: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: any, noAuth?: boolean): Promise<Response<T>> => {
    try {
        const token = !noAuth && localStorage.getItem('masteringcreditstoken');
        const response = await fetch(apiBaseUrl + path, {
            headers: {
                'Content-Type': 'application/json',
                ...(!noAuth && token && { Authorization: 'Bearer ' + token })
            },
            method,
            body: body ? JSON.stringify(body) : null
        });
        const data = await response.json();
        if (response.status !== 200) {
            return { status: response.status, isError: true, errorMessage: data.message[0]?.messages[0]?.message, data };
        }
        return { status: response.status, isError: false, errorMessage: undefined, data };
    }
    catch (e) {
        return { status: 500, isError: true, errorMessage: 'Unknown Error' };
    }
};

export const getPage = async (path: string): Promise<Response<Page>> => {
    return await invokeApi('/pages/' + path, 'GET', undefined, true);
};

export const getGlobalData = async (): Promise<Response<GlobalData>> => {
    return await invokeApi('/global', 'GET', undefined, true);
};

export const getIntegrations = async (): Promise<Response<Integrations>> => {
    return await invokeApi('/integrations', 'GET', undefined, true);
};

export const getCookieConfig = async (): Promise<Response<CookieConfig>> => {
    return await invokeApi('/cookies', 'GET', undefined, true);
};

export const getShopConfig = async (): Promise<Response<ShopConfig>> => {
    return await invokeApi('/shop', 'GET', undefined, true);
};

export const createMessage = async (message: Message, captchaToken: string): Promise<Response<boolean>> => {
    return await invokeApi(`/messages?captchaToken=${captchaToken}`, 'POST', { ...message }, true);
};

export const createOrder = async (order: Order, captchaToken: string): Promise<Response<boolean>> => {
    return await invokeApi(`/orders?captchaToken=${captchaToken}`, 'POST', { ...order }, true);
};

export const getProduct = async (identifier: string): Promise<Response<Product>> => {
    const query = stringify({ q: identifier }).substring(2);
    return await invokeApi(`/products/${query}`, 'GET', undefined, true);
};

export const getProducts = async (query: ProductQuery): Promise<Response<Product[]>> => {
    const _query = stringify(query);
    return await invokeApi(`/products${_query ? `?${_query}` : ''}`, 'GET', undefined, true);
};

export const countProducts = async (query: ProductQuery): Promise<Response<number>> => {
    const _query = stringify(query);
    return await invokeApi(`/products/count${_query ? `?${_query}` : ''}`, 'GET', undefined, true);
};