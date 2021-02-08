import React, { useMemo, useEffect, useContext, useCallback } from 'react';
import { NextPage } from 'next';
import { createStyles, makeStyles, Theme, fade } from '@material-ui/core/styles';
import { getProduct } from '../../src/tools/Service';
import { DocumentsSection, GallerySection, HeroSection, Product } from '../../src/tools/Models';
import { parse } from 'marked';
import { CircularProgress } from '@material-ui/core';
import { useRouter } from 'next/router';
import { NotificationContext } from '../../src/contexts/NotificationContext';
import Button from '../../src/components/styledComponents/StyledButton';
import { ShopContext } from '../../src/contexts/ShopContext';
import { formatCurrency } from '../../src/tools/Utils';
import Gallery from '../../src/components/sections/Gallery';
import Hero from '../../src/components/sections/Hero';
import Documents from '../../src/components/sections/Documents';

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
        details: {
            width: '100%',
            padding: 32,
            maxWidth: 1080,
            '& h1': {
                paddingTop: 6,
                paddingBottom: 12,
                margin: 0,
                fontSize: 44,
                fontWeight: 700,
                lineHeight: 1.2,
                color: theme.palette.sectionStyles.text?.text || theme.palette.text.primary
            },
            '& h2': {
                paddingTop: 6,
                paddingBottom: 12,
                margin: 0,
                fontSize: 36,
                fontWeight: 500,
                lineHeight: 1.2,
                color: theme.palette.sectionStyles.text?.text || theme.palette.text.primary
            },
            '& h3': {
                paddingTop: 6,
                paddingBottom: 12,
                margin: 0,
                fontSize: 30,
                fontWeight: 500,
                lineHeight: 1.2,
                color: theme.palette.sectionStyles.text?.text || theme.palette.text.primary
            },
            '& h4': {
                paddingTop: 6,
                paddingBottom: 12,
                margin: 0,
                fontSize: 28,
                fontWeight: 400,
                lineHeight: 1.2,
                color: theme.palette.sectionStyles.text?.text || theme.palette.text.primary
            },
            '& h5': {
                paddingTop: 6,
                paddingBottom: 12,
                margin: 0,
                fontSize: 28,
                fontWeight: 400,
                lineHeight: 1.2,
                color: theme.palette.sectionStyles.text?.text || theme.palette.text.primary
            },
            '& h6': {
                paddingTop: 6,
                paddingBottom: 12,
                margin: 0,
                fontSize: 28,
                fontWeight: 400,
                lineHeight: 1.2,
                color: theme.palette.sectionStyles.text?.text || theme.palette.text.primary
            },
            '& p': {
                margin: 0,
                marginTop: 18,
                fontSize: 17,
                fontWeight: 300,
                color: theme.palette.sectionStyles.text?.text || theme.palette.text.primary
            },
            '& ul': {
                margin: 0,
                paddingTop: 24,
                paddingBottom: 24,
                fontSize: 18,
                fontWeight: 400,
                color: theme.palette.sectionStyles.text?.text || theme.palette.text.primary,
                paddingLeft: 18
            },
            '& ol': {
                margin: 0,
                paddingTop: 24,
                paddingBottom: 24,
                fontSize: 18,
                fontWeight: 400,
                color: theme.palette.sectionStyles.text?.text || theme.palette.text.primary,
                paddingLeft: 18
            },
            '& img': {
                maxWidth: '100%',
                margin: 'auto',
                display: 'block'
            },
            '& table': {
                borderCollapse: 'collapse',
                fontSize: 17,
                fontWeight: 400,
                width: '100%'
            },
            '& td': {
                padding: 8
            },
            '& th': {
                textAlign: 'left',
                fontWeight: 600,
                padding: 8,
                paddingTop: 12,
                paddingBottom: 12,
                backgroundColor: theme.palette.sectionStyles.text?.text || theme.palette.text.primary,
                color: theme.palette.sectionStyles.text?.background || theme.palette.backgrounds.main
            },
            '& tr': {
                '&:nth-child(even)': {
                    backgroundColor: fade(theme.palette.sectionStyles.text?.text || theme.palette.text.primary, 0.2)
                }
            }
        },
        '@media (max-width: 800px)': {
            details: {
                padding: 24,
                '& h1': {
                    fontSize: 32,
                },
                '& h2': {
                    fontSize: 28
                },
                '& h3': {
                    fontSize: 24
                },
                '& h4': {
                    fontSize: 20
                },
                '& h5': {
                    fontSize: 18
                },
                '& h6': {
                    fontSize: 18
                }
            }
        }
    }),
);

const ProductPage: NextPage<{ product: Product }> = ({ product }) => {
    const { id, name, description, image, price, images, availible, documents, details } = product;
    const classes = useStyles();
    const parsedContent = useMemo(() => parse(details || ''), [details]);
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
            <div className={classes.details} dangerouslySetInnerHTML={{ __html: parsedContent }} />
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
