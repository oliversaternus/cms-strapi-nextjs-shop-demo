import React, { useMemo, useEffect, useContext, useCallback } from 'react';
import { NextPage } from 'next';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { getProduct } from '../../src/tools/Service';
import { DocumentsSection, GallerySection, HeroSection, TextSection, Product } from '../../src/tools/Models';
import { CircularProgress } from '@material-ui/core';
import { useRouter } from 'next/router';
import { NotificationContext } from '../../src/contexts/NotificationContext';
import Button from '../../src/components/styledComponents/StyledButton';
import { ShopContext } from '../../src/contexts/ShopContext';
import { formatCurrency } from '../../src/tools/Utils';
import Gallery from '../../src/components/sections/Gallery';
import Hero from '../../src/components/sections/Hero';
import Documents from '../../src/components/sections/Documents';
import Text from '../../src/components/sections/Text';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexDirection: 'column'
        },
        buttonContainer: {
            marginTop: 8
        },
    }),
);

const ProductPage: NextPage<{ product: Product }> = ({ product }) => {
    const { id, name, description, image, price, images, availible, documents, details } = product;
    const classes = useStyles();
    const { openNotification } = useContext(NotificationContext);
    const { addToCart, shopCurrency } = useContext(ShopContext);
    const router = useRouter();

    const handleAddToCart = useCallback(() => {
        const success = addToCart(product);
        if (!success) {
            openNotification('error', 'Maximum Quantity reached. Please contact us for custom order.');
            return;
        };
        openNotification('success', 'Added to cart');
    }, [addToCart, product]);

    const formattedPrice = useMemo(() => ((price || price === 0) && formatCurrency(price, shopCurrency)), [price, shopCurrency]);

    const heroSection = useMemo((): HeroSection => ({
        __component: 'section.hero',
        id: 1,
        image,
        content: `# ${name}\n## ${formattedPrice}`
    }), [image, name, formattedPrice]);

    const gallerySection = useMemo((): GallerySection => ({
        __component: 'section.gallery',
        id: 2,
        headline: 'Gallery',
        images
    }), [images]);

    const documentsSection = useMemo((): DocumentsSection => ({
        __component: 'section.documents',
        id: 3,
        headline: 'Documents',
        files: documents || []
    }), [documents]);

    const textSection = useMemo((): TextSection => ({
        __component: 'section.text',
        id: 4,
        content: details
    }), [documents]);

    useEffect(() => {
        if (id === 0 && name === '__empty') {
            openNotification('error', 'Product not found.');
            router.replace('/');
        }
    }, [id, name]);

    if (id === 0 && name === '__empty') {
        return (
            <div className="loading-overlay">
                <CircularProgress color="secondary" />
            </div>
        );
    }

    return (
        <div className={classes.root}>
            <Hero hero={heroSection}>
                <div className={classes.buttonContainer}>
                    <Button onClick={handleAddToCart} _color='light'>
                        Add to Cart
                    </Button>
                </div>
            </Hero>
            <Text text={textSection} />
            {images?.length ? <Gallery gallery={gallerySection} /> : null}
            {documents?.length ? <Documents documents={documentsSection} /> : null}
        </div>
    );
}

ProductPage.getInitialProps = async ({ query }): Promise<{ product: Product }> => {
    const productResponse = await getProduct(query.identifier + '');
    const product: Product = (!productResponse.isError && productResponse.data) || { id: 0, name: '__empty' } as Product;

    return { product };
}

export default ProductPage;
