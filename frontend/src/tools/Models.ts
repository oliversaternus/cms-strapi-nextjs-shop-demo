export type Blog = {
    id?: number;
    image?: Image;
    title?: string;
    subtitle?: string;
    description?: string;
    keywords?: string;
    header?: string;
    subHeader?: string;
    color?: string;
};

export type Page = {
    id?: number;
    title?: string;
    subtitle?: string;
    description?: string;
    keywords?: string;
    content?: PageContent[];
};

export type GlobalData = {
    id?: number;
    logo?: Image;
    favicon?: Image;
    previewImage?: Image;
    copyright?: string;
    navigation?: NavigationArea;
    footer?: NavigationArea;
};

export type CookieConfig = {
    id?: number;
    enabled?: boolean;
    settingsEnabled?: boolean;
    message?: string;
    configuration?: Array<{
        value: 'none' | 'essential' | 'all',
        type: string,
        info: string
    }>
};

export type Currency = 'Euro' | 'Dollar' | 'Pound' | 'Yen';

export type ShopConfig = {
    id?: number;
    currency?: Currency,
    maxQuantity?: number;
    checkoutMessage?: string;
    shippingInfo?: string;
    shipping?: Array<{
        id: number;
        countries?: string;
        price: number;
    }>
};

export type NavigationArea = Array<{
    id: number;
    title?: string;
    links?: Array<{
        id: number;
        link?: string;
        path?: string;
        imageUrl?: string;
    }>;
}>;

export type PageContent = (HeroSection | CardsSection | BannerSection | QuoteSection | TextSection | TextWithImageSection);

export type Section = {
    __component: string;
    id: number;
    content?: string;
    backgroundImage?: Image;
};

export type Author = {
    id: number;
    name: string;
    image: Image;
    description: string;
    posts: Post[];
    twitter: string;
};

export type Post = {
    id: number;
    identifier: string;
    author?: Author;
    keywords: string;
    description?: string;
    title: string;
    subtitle: string;
    image: Image;
    content: string;
    duration: number;
    topic: string;
    created_at: string;
    updated_at: string;
};

export type PostQuery = {
    author?: { name: string };
    topic?: string;
    _q?: string;
    _sort?: string;
    _limit?: number;
    _start?: number;
};

export type Image = {
    id: number;
    name: string;
    alternativeText: string;
    caption: string;
    width: number;
    height: number;
    formats: {
        thumbnail: ImageFormat;
        medium: ImageFormat;
        small: ImageFormat;
    },
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl?: string;
    provider: string;
    provider_metadata?: string;
    created_at: string;
    updated_at: string;
};

export type ImageFormat = {
    hash: string;
    ext: string;
    mime: string;
    width: number;
    height: number;
    size: number;
    path?: string;
    url: string;
};

export type File = {
    id: number;
    name: string;
    alternativeText: string;
    caption: string;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    provider: string;
    provider_metadata?: string;
    created_at: string;
    updated_at: string;
};

export interface Response<T> {
    status: number;
    isError: boolean;
    errorMessage?: string;
    data?: T;
};

export type HeroSection = {
    __component: string;
    id: number;
    identifier?: string;
    content?: string;
    button?: ButtonComponent;
    image?: Image;
};

export type CardsSection = {
    __component: string;
    id: number;
    identifier?: string;
    cards: CardsSectionItem[];
    headline?: string;
};

export type CardsSectionItem = {
    content?: string;
    headline?: string;
    id: number;
    image?: Image;
    link?: string;
    linkText?: string;
    variant?: 'standart' | 'person';
};

export type BannerSection = {
    __component: string;
    id: number;
    identifier?: string;
    content?: string;
    button?: ButtonComponent;
    image?: Image;
};

export type TextSection = {
    __component: string;
    id: number;
    identifier?: string;
    content?: string;
};

export type DocumentsSection = {
    __component: string;
    id: number;
    identifier?: string;
    files: File[];
    headline?: string;
};

export type TextWithImageSection = {
    __component: string;
    id: number;
    identifier?: string;
    content?: string;
    button?: ButtonComponent;
    image?: Image;
    align?: 'left' | 'right'
};

export type QuoteSection = {
    __component: string;
    id: number;
    identifier?: string;
    content?: string;
    author?: string;
    image?: Image;
    company?: string;
};

export type ContactSection = {
    __component: string;
    id: number;
    identifier?: string;
    headline?: string;
};

export type GallerySection = {
    __component: string;
    id: number;
    identifier?: string;
    headline?: string;
    images?: Image[];
};

export type LocationSection = {
    __component: string;
    id: number;
    identifier?: string;
    headline?: string;
    name?: string;
    city?: string;
    code?: string;
    street?: string;
    house?: string;
};

export type ButtonComponent = {
    id: number;
    content?: string;
    link?: string;
    trackingEvent?: TrackingEvent;
};

export type Message = {
    content: string;
    email: string;
    subject: string;
    salutation: string;
    firstName: string;
    lastName: string;
}

export type TrackingEvent = {
    category: string;
    action: string;
    value?: number;
    label?: string;
    nonInteraction?: boolean;
    transport?: 'beacon' | 'xhr' | 'image'
}

export type Integrations = {
    Analytics?: {
        id: number;
        GATrackingID?: string;
        cookieValue?: string;
        anonymousTracking?: boolean;
        enabled?: boolean;
    };
    Chat?: {
        id: number;
        TawkToID?: string;
        cookieValue?: string;
        enabled?: boolean;
    };
    ReCaptcha?: {
        enabled?: boolean;
        publicKey?: string;
    }
}

export type Product = {
    id: number;
    identifier?: string;
    name?: string;
    description?: string;
    image?: Image;
    price?: number;
    images?: Image[];
    details?: string;
    availible?: boolean;
    documents?: File[];
};

export type CartItem = {
    id: string;
    product: Product;
    quantity: number;
};

export type ProductQuery = {
    price_gte?: number;
    price_lte?: number
    _q?: string;
    _sort?: string;
    _limit?: number;
    _start?: number;
};

export type Order = {
    firstName: string;
    lastName: string;
    email: string;
    shippingCountry: string;
    totalPrice: number;
    shippingPrice: number;
    items: Array<{
        product: Product,
        quantity: number
    }>;
};
