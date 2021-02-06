import React, { useState, useRef, useContext, useMemo } from 'react';
import { createStyles, makeStyles, fade } from '@material-ui/core/styles';
import { IconButton, Theme, Avatar } from '@material-ui/core';
import { ShoppingCart, DeleteForever as DeleteIcon, ShoppingCartOutlined } from '@material-ui/icons';
import Link from 'next/link';
import Fade from '@material-ui/core/Fade';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { ShopContext } from '../../contexts/ShopContext';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import { formatCurrency } from '../../tools/Utils';
import { useRouter } from 'next/router';

type CartMenuProps = {
    cartURL: string;
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        cartIcon: {
            fill: theme.palette.componentStyles.navigation?.main.text || theme.palette.text.primary,
            height: 32,
            width: 32
        },
        cartPaper: {
            overflow: 'hidden'
        },
        cartPaperContent: {
            maxWidth: 400
        },
        cartTitle: {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            color: theme.palette.componentStyles.navigation?.main.text || theme.palette.text.primary,
            fontSize: 16,
            fontWeight: 600,
            borderBottom: `1px solid ${fade(theme.palette.componentStyles.navigation?.main.text || theme.palette.text.primary, 0.2)}`,
            marginBottom: 6
        },
        cartEmptyIcon: {
            width: 32,
            height: 32,
            fill: theme.palette.componentStyles.navigation?.main.text || theme.palette.text.primary
        },
        cartEmpty: {
            color: theme.palette.componentStyles.navigation?.main.text || theme.palette.text.primary,
            fontSize: 14,
            fontWeight: 400,
            padding: 12,
            paddingLeft: 32,
            paddingRight: 32,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        },
        cartItemContainer: {
            position: 'relative',
            display: 'flex',
            width: '100%',
            padding: 6,
            paddingRight: 96
        },
        cartItemImage: {
            margin: 12
        },
        cartItemDetails: {
            paddingLeft: 6
        },
        cartItemTitle: {
            color: theme.palette.componentStyles.navigation?.main.text || theme.palette.text.primary,
            fontSize: 16,
            fontWeight: 500,
            paddingBotom: 6
        },
        cartItemPrice: {
            color: theme.palette.componentStyles.navigation?.main.textStrong || theme.palette.componentStyles.navigation?.main.text || theme.palette.text.primary,
            fontSize: 16,
            fontWeight: 500,
            paddingBotom: 6
        },
        cartItemQuantity: {
            color: theme.palette.componentStyles.navigation?.main.textLight || theme.palette.componentStyles.navigation?.main.text || theme.palette.text.primary,
            fontSize: 14,
            fontWeight: 400
        },
        checkoutButton: {
            borderRadius: 0,
            paddingTop: 12,
            paddingBottom: 12,
            marginTop: 6
        },
        removeFromCartButton: {
            position: 'absolute',
            right: 12
        },
        link: {
            color: theme.palette.componentStyles.navigation?.main.text || theme.palette.text.primary,
            '&:hover': {
                textDecoration: 'none',
                color: theme.palette.componentStyles.navigation?.main.text || theme.palette.text.primary
            }
        }
    }),
);

const CartMenu: React.FC<CartMenuProps> = ({ cartURL }) => {
    const classes = useStyles();
    const cartMenuRef = useRef<HTMLButtonElement>(null);
    const [cartMenuOpen, setCartMenuOpen] = useState(false);
    const { items: cartItems, totalQuantity, removeFromCart } = useContext(ShopContext);
    const router = useRouter();

    const isOnCart = useMemo(() => router.pathname.startsWith('/cart'), [router, router.pathname]);

    const handleCartOpen = () => {
        if (!isOnCart) {
            setCartMenuOpen(true);
        }
    };

    const handleCartClose = () => {
        setCartMenuOpen(false);
    };

    const handleRemoveFromCart = (cartId: string) => () => {
        removeFromCart(cartId);
    }

    return (
        <React.Fragment>
            <IconButton ref={cartMenuRef} onClick={handleCartOpen}>
                <Badge badgeContent={totalQuantity} color="secondary">
                    <ShoppingCart className={classes.cartIcon} />
                </Badge>
            </IconButton>
            <Popper open={cartMenuOpen && !isOnCart} anchorEl={cartMenuRef.current} role={undefined} transition disablePortal>
                {({ TransitionProps, placement }) => (
                    <Fade
                        {...TransitionProps}
                        style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                    >
                        <Paper elevation={4} className={classes.cartPaper}>
                            <ClickAwayListener onClickAway={handleCartClose}>
                                <div className={classes.cartPaperContent}>
                                    <div className={classes.cartTitle}>Shopping Cart</div>
                                    {cartItems.length === 0 &&
                                        <div className={classes.cartEmpty}>
                                            <ShoppingCartOutlined className={classes.cartEmptyIcon} /> No items in cart
                                                        </div>}
                                    {cartItems.map(cartItem => (
                                        <div key={cartItem.id} className={classes.cartItemContainer}>
                                            <Avatar
                                                className={classes.cartItemImage}
                                                src={cartItem.product.image?.formats.thumbnail.url + ''}
                                            />
                                            <div className={classes.cartItemDetails}>
                                                <Link href={`/product/${cartItem.product.id}`}>
                                                    <a className={classes.link} onClick={handleCartClose}>
                                                        <div className={classes.cartItemTitle}>
                                                            {cartItem.product.name}
                                                        </div>
                                                    </a>
                                                </Link>
                                                <div className={classes.cartItemPrice}>
                                                    {formatCurrency(cartItem.product.price)}
                                                </div>
                                                <div className={classes.cartItemQuantity}>
                                                    {`Quantity: ${cartItem.quantity}`}
                                                </div>
                                            </div>
                                            <IconButton color="primary" className={classes.removeFromCartButton} onClick={handleRemoveFromCart(cartItem.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </div>
                                    ))}
                                    {cartItems.length ?
                                        <Link href={cartURL}>
                                            <Button className={classes.checkoutButton} variant="contained" fullWidth color='primary' onClick={handleCartClose}>Checkout</Button>
                                        </Link> :
                                        <Button className={classes.checkoutButton} variant="contained" fullWidth color='primary' onClick={handleCartClose}>OK</Button>
                                    }
                                </div>
                            </ClickAwayListener>
                        </Paper>
                    </Fade>
                )}
            </Popper>
        </React.Fragment >
    );
}

export default CartMenu;