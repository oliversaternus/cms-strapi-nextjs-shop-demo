import React, { useContext, useMemo, useCallback, useState } from 'react';
import { NextPage } from 'next';
import { createStyles, makeStyles, fade } from '@material-ui/core/styles';
import { CartItem, Page } from '../src/tools/Models';
import { ShopContext } from '../src/contexts/ShopContext';
import Grid from '@material-ui/core/Grid';
import Image from '../src/components/styledComponents/StyledImage';
import CartSummary from '../src/components/shop/CartSummary';
import { formatCurrency } from '../src/tools/Utils';
import Select from '../src/components/styledComponents/StyledSelect';
import { DeleteForever as DeleteIcon, ShoppingCartOutlined } from '@material-ui/icons';
import clsx from 'clsx';
import Link from 'next/link';
import { IconButton } from '@material-ui/core';
import CheckoutDialog from '../src/components/shop/CheckoutDialog';
import CartIcon from '../src/icons/CartIcon';

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
            minHeight: '100vh',
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
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            paddingTop: 16,
            paddingBottom: 14,
            color: theme.palette.componentStyles.shop?.main.text || theme.palette.text.primary,
            fontSize: 24,
            fontWeight: 500,
            borderBottom: `1px solid ${fade(theme.palette.componentStyles.shop?.main.text || theme.palette.text.primary, 0.2)}`,
            marginRight: 24
        },
        cartSummary: {
            marginTop: 64,
            maxWidth: 300,
            width: 300,
        },
        cartRow: {
            display: 'flex',
            width: '100%',
            marginTop: 12
        },
        cartItemContainer: {
            display: 'flex'
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
        itemsCount: {
            fontSize: 16,
            fontWeight: 400,
        },
        emptyCart: {
            paddingTop: 32,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            color: theme.palette.componentStyles.shop?.main.textLight || theme.palette.componentStyles.shop?.main.text || theme.palette.text.primary,
            fontSize: 18
        },
        emptyCartIcon: {
            fill: theme.palette.componentStyles.shop?.main.textLight || theme.palette.componentStyles.shop?.main.text || theme.palette.text.primary,
            width: 64,
            height: 64
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
                marginTop: 0,
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
            }
        },
        '@media (max-width: 400px)': {
            cartItemCell: {
                paddingLeft: 16,
                padding: 6,
                paddingRight: 0
            },
            container: {
                padding: 24
            }
        },
        '@media (max-width: 320px)': {
            cartItemImage: {
                height: 96,
                width: 96
            },
        }
    }),
);

const CartPage: NextPage<{}> = () => {
    const classes = useStyles();
    const { items: cartItems, setQuantity, maxQuantity, removeFromCart, checkoutMessage, shopCurrency, totalQuantity } = useContext(ShopContext);
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

    return (
        <div className={classes.root}>
            <div className={classes.container}>
                <div className={classes.contentContainer}>
                    <div className={classes.cartTitle}>Cart<div className={classes.itemsCount}>{`${totalQuantity} items`}</div></div>
                    {!cartItems.length &&
                        <div className={classes.emptyCart}>
                            <CartIcon className={classes.emptyCartIcon} />
                            No items in cart
                        </div>}
                    {cartItems.map(item => (
                        <div className={classes.cartRow} key={item.id}>
                            <Link href={`/product/${item.product.identifier}`}>
                                <a>
                                    <Image
                                        className={classes.cartItemImage}
                                        src={item.product.image?.formats.thumbnail.url + ''}
                                        altText={item.product.image?.alternativeText}
                                        previewUrl={item.product.image?.previewUrl}
                                    />
                                </a>
                            </Link>
                            <Grid container className={classes.cartItemContainer} key={item.id}>
                                <Grid item xs className={clsx(classes.cartItemCell, classes.titleCell)}>
                                    <Link href={`/product/${item.product.identifier}`}>
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
                                    {formatCurrency((item.product.price || 0) * item.quantity, shopCurrency)}
                                    <IconButton className={classes.deleteButton} color='primary' onClick={handleRemoveFromCart(item)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </div>))
                    }
                </div>
                <CartSummary className={classes.cartSummary} onProceed={handleCheckoutOpen} />
            </div>
            <CheckoutDialog open={checkoutOpen} onClose={handleCheckoutClose} message={checkoutMessage} />
        </div>);
}

export async function getStaticProps() {
    const page: Page = {
        title: 'Cart',
        description: 'Your selected shopping items'
    };

    return {
        props: {
            page
        },
    }
}

export default CartPage;