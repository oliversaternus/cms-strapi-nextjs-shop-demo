import React, { useMemo, useEffect, useContext, useCallback } from 'react';
import { NextPage } from 'next';
import { createStyles, makeStyles, Theme, fade, lighten } from '@material-ui/core/styles';
import { getProduct } from '../../src/tools/Service';
import { Product } from '../../src/tools/Models';
import { parse } from 'marked';
import { CircularProgress, Avatar } from '@material-ui/core';
import { useRouter } from 'next/router';
import { NotificationContext } from '../../src/contexts/NotificationContext';
import Image from '../../src/components/styledComponents/StyledImage';
import Button from '../../src/components/styledComponents/StyledButton';
import { ShopContext } from '../../src/contexts/ShopContext';
import { formatCurrency } from '../../src/tools/Utils';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexDirection: 'column'
        },
        header: {
            width: '100%',
            height: 340,
            padding: 32,
            maxWidth: 1080,
            display: 'flex',
            flexWrap: 'wrap',
            minHeight: '60vh',
        },
        titleContainer: {
            paddingLeft: 32,
            fontSize: 32,
            width: '40%',
            paddingRight: 16,
            minWidth: 240,
        },
        title: {
            fontSize: 32
        },
        description: {
            paddingTop: 24,
            paddingBottom: 24,
            fontSize: 16
        },
        price: {
            paddingTop: 8,
            paddingBottom: 8,
            fontSize: 24
        },
        image: {
            width: '60%',
            minWidth: 240,
            minHeight: 160
        },
        details: {
            '& h1': {
                paddingTop: 6,
                paddingBottom: 6,
                margin: 0,
                fontSize: 32,
                fontWeight: 500,
                lineHeight: 1.2,
                color: theme.palette.sectionStyles.text?.text || theme.palette.text.primary
            },
            '& h2': {
                paddingTop: 6,
                paddingBottom: 6,
                margin: 0,
                fontSize: 32,
                fontWeight: 500,
                lineHeight: 1.2,
                color: theme.palette.sectionStyles.text?.text || theme.palette.text.primary
            },
            '& h3': {
                paddingTop: 6,
                paddingBottom: 6,
                margin: 0,
                fontSize: 32,
                fontWeight: 500,
                lineHeight: 1.2,
                color: theme.palette.sectionStyles.text?.text || theme.palette.text.primary
            },
            '& h4': {
                paddingTop: 6,
                paddingBottom: 6,
                margin: 0,
                fontSize: 32,
                fontWeight: 500,
                lineHeight: 1.2,
                color: theme.palette.sectionStyles.text?.text || theme.palette.text.primary
            },
            '& h5': {
                paddingTop: 6,
                paddingBottom: 6,
                margin: 0,
                fontSize: 32,
                fontWeight: 500,
                lineHeight: 1.2,
                color: theme.palette.sectionStyles.text?.text || theme.palette.text.primary
            },
            '& p': {
                margin: 0,
                fontSize: 16,
                fontWeight: 300,
                color: theme.palette.sectionStyles.text?.text || theme.palette.text.primary
            },
            '& ul': {
                margin: 0,
                paddingBottom: 32,
                fontSize: 16,
                fontWeight: 300,
                color: theme.palette.sectionStyles.text?.text || theme.palette.text.primary,
                paddingLeft: 18
            },
            '& ol': {
                margin: 0,
                paddingBottom: 32,
                fontWeight: 300,
                fontSize: 16,
                color: theme.palette.sectionStyles.text?.text || theme.palette.text.primary,
                paddingLeft: 18
            },
            '& table': {
                borderCollapse: 'collapse'
            },
            '& td': {
                border: `1px solid ${lighten(theme.palette.sectionStyles.text?.text || theme.palette.text.primary, 0.6)}`,
                padding: 8
            },
            '& th': {
                textAlign: 'left',
                fontWeight: 600,
                border: `1px solid ${theme.palette.sectionStyles.text?.text || theme.palette.text.primary}`,
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
            titleContainer: {
                width: '100%',
                paddingRight: 0
            },
            image: {
                marginTop: 24,
                width: '100%'
            },
            header: {
                height: 'auto'
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
        };
    }, [addToCart, product]);

    const formattedPrice = useMemo(() => ((price || price === 0) && formatCurrency(price, shopCurrency)), [price, shopCurrency]);

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
            <div className={classes.header}>
                {image && <Image className={classes.image} src={image?.url || ''} previewUrl={image?.previewUrl} />}
                <div className={classes.titleContainer}>
                    <div className={classes.title}>
                        {name}
                    </div>
                    <div className={classes.description}>
                        {description}
                    </div>
                    <div className={classes.price}>
                        {formattedPrice}
                    </div>
                    <Button onClick={handleAddToCart} _color='primary'>
                        Add to Cart
                    </Button>
                </div>
            </div>
            <div className={classes.details} dangerouslySetInnerHTML={{ __html: parsedContent }} />
        </div>
    );
}

ProductPage.getInitialProps = async ({ query }): Promise<{ product: Product }> => {
    const productResponse = await getProduct(query.identifier + '');
    const product: Product = (!productResponse.isError && productResponse.data) || { id: 0, name: '__empty' } as Product;

    return { product };
}

export default ProductPage;
