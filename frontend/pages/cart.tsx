import React, { useContext, useMemo, useCallback, useState } from 'react';
import { NextPage } from 'next';
import { createStyles, makeStyles, fade } from '@material-ui/core/styles';
import { CartItem, Page } from '../src/tools/Models';
import { getPage } from '../src/tools/Service';
import Error from './404';
import { ShopContext } from '../src/contexts/ShopContext';
import Grid from '@material-ui/core/Grid';
import Image from '../src/components/styledComponents/StyledImage';
import CartSummary from '../src/components/shop/CartSummary';
import { formatCurrency } from '../src/tools/Utils';
import Select from '../src/components/styledComponents/StyledSelect';
import { DeleteForever as DeleteIcon } from '@material-ui/icons';
import clsx from 'clsx';
import Link from 'next/link';
import { IconButton } from '@material-ui/core';
import CheckoutDialog from '../src/components/shop/CheckoutDialog';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexDirection: 'column'
        },
        container: {
            width: '100%',
            padding: 32,
            maxWidth: 1080,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between'
        },
        contentContainer: {
            flexGrow: 1,
            padding: 32,
            paddingTop: 0,
            paddingLeft: 0
        },
        cartTitle: {
            paddingTop: 16,
            paddingBottom: 14,
            color: theme.palette.componentStyles.shop?.main.text || theme.palette.text.primary,
            fontSize: 24,
            fontWeight: 500,
            borderBottom: `1px solid ${fade(theme.palette.componentStyles.shop?.main.text || theme.palette.text.primary, 0.2)}`,
            marginRight: 24
        },
        cartSummary: {
            maxWidth: 300,
            width: 300,
        },
        cartItemContainer: {
            display: 'flex',
            marginTop: 12
        },
        cartItemImage: {
            height: 128,
            width: 128,
            cursor: 'pointer'
        },
        cartItemCell: {
            padding: 24,
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            color: theme.palette.componentStyles.shop?.main.textLight || theme.palette.componentStyles.shop?.main.text || theme.palette.text.primary,
            fontSize: 16,
            fontWeight: 500
        },
        titleCell: {
        },
        titleLink: {
            color: theme.palette.componentStyles.shop?.main.textLight || theme.palette.componentStyles.shop?.main.text || theme.palette.text.primary,
            '&:hover': {
                textDecoration: 'none',
                color: theme.palette.componentStyles.shop?.main.textLight || theme.palette.componentStyles.shop?.main.text || theme.palette.text.primary
            }
        },
        quantityCell: {
            justifyContent: 'center'
        },
        quantitySelect: {
            width: 96
        },
        priceCell: {
            justifyContent: 'flex-end'
        },
        deleteButton: {
            marginLeft: 6
        },
        '@media (max-width: 1080px)': {
            contentContainer: {
                paddingRight: 0,
                width: '100%'
            },
            container: {
                flexDirection: 'column'
            },
            cartSummary: {
                maxWidth: 1080,
                width: '100%',
            }
        },
        '@media (max-width: 640px)': {
            cartItemContainer: {
                flexDirection: 'column'
            },
            quantityCell: {
                justifyContent: 'flex-start'
            },
            priceCell: {
                justifyContent: 'flex-start'
            },
            cartItemCell: {
                paddingTop: 12,
                paddingBottom: 12
            },
            cartItemImage: {
                height: 196,
                width: 196
            }
        }
    }),
);

const CartPage: NextPage<{ page: Page }> = ({ page }) => {
    const { id, content } = page;
    const classes = useStyles();
    const { items: cartItems, setQuantity, maxQuantity, removeFromCart, checkoutMessage } = useContext(ShopContext);
    const [checkoutOpen, setCheckoutOpen] = useState(false);

    const quantities = useMemo(() => {
        const result = [];
        for (let i = 0; i < maxQuantity; i++) {
            result.push(i + 1);
        }
        return result;
    }, []);

    const handleChangeQuantity = useCallback((cartItem: CartItem) => (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setQuantity(cartItem.id, Number(event.target.value));
    }, []);

    const handleRemoveFromCart = useCallback((cartItem: CartItem) => () => {
        removeFromCart(cartItem.id);
    }, []);

    const handleCheckoutOpen = () => setCheckoutOpen(true);
    const handleCheckoutClose = () => setCheckoutOpen(false);

    /*
    if (!id) {
        return <Error />;
    }
    */

    return (
        <div className={classes.root}>
            <div className={classes.container}>
                <div className={classes.contentContainer}>
                    <div className={classes.cartTitle}>Cart</div>
                    {cartItems.map(item => (
                        <Grid container className={classes.cartItemContainer} key={item.id}>
                            <Grid item>
                                <Link href={`/product/${item.product.id}`}>
                                    <a>
                                        <Image
                                            className={classes.cartItemImage}
                                            src={item.product.image?.formats.thumbnail.url + ''}
                                            previewUrl={item.product.image?.previewUrl}
                                        />
                                    </a>
                                </Link>
                            </Grid>
                            <Grid item xs className={clsx(classes.cartItemCell, classes.titleCell)}>
                                <Link href={`/product/${item.product.id}`}>
                                    <a className={classes.titleLink}>
                                        {item.product.name}
                                    </a>
                                </Link>
                            </Grid>
                            <Grid item xs className={clsx(classes.cartItemCell, classes.quantityCell)}>
                                <Select
                                    className={classes.quantitySelect}
                                    value={item.quantity}
                                    onChange={handleChangeQuantity(item)}
                                    values={quantities.map(num => (
                                        {
                                            label: num + '',
                                            value: num,
                                        })
                                    )}
                                />
                            </Grid>
                            <Grid item xs className={clsx(classes.cartItemCell, classes.priceCell)}>
                                {formatCurrency((item.product.price || 0) * item.quantity)}
                                <IconButton className={classes.deleteButton} color='primary' onClick={handleRemoveFromCart(item)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Grid>
                        </Grid>))
                    }
                </div>
                <CartSummary className={classes.cartSummary} onProceed={handleCheckoutOpen} />
            </div>
            <CheckoutDialog open={checkoutOpen} onClose={handleCheckoutClose} message={checkoutMessage} />
        </div>);
}

CartPage.getInitialProps = async (): Promise<{ page: Page }> => {
    const pageResponse = await getPage('cart');
    const page: Page = (!pageResponse.isError && pageResponse.data) || {};

    return { page };
}

export default CartPage;