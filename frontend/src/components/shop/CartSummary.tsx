import React, { useState, useRef, useContext, useMemo, useEffect } from 'react';
import { createStyles, makeStyles, fade } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core';
import { ShopContext } from '../../contexts/ShopContext';
import Button from '../styledComponents/StyledButton';
import { formatCurrency } from '../../tools/Utils';
import clsx from 'clsx';

type CartSummaryProps = {
    className?: string;
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            border: `1px solid ${fade(theme.palette.componentStyles.navigation?.main.text || theme.palette.text.primary, 0.2)}`,
            padding: 24,
            borderRadius: 4
        },
        title: {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            paddingTop: 0,
            color: theme.palette.componentStyles.navigation?.main.text || theme.palette.text.primary,
            fontSize: 16,
            fontWeight: 600,
            borderBottom: `1px solid ${fade(theme.palette.componentStyles.navigation?.main.text || theme.palette.text.primary, 0.2)}`,
            marginBottom: 12
        },
        summaryRow: {
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            padding: 6,
            paddinTop: 12,
            paddingBottom: 12
        },
        rowTitle: {
            color: theme.palette.componentStyles.navigation?.main.textStrong || theme.palette.componentStyles.navigation?.main.text || theme.palette.text.primary,
            fontSize: 16,
            fontWeight: 500,
            paddingBotom: 6
        },
        rowValue: {
            color: theme.palette.componentStyles.navigation?.main.textLight || theme.palette.componentStyles.navigation?.main.text || theme.palette.text.primary,
            fontSize: 16,
            fontWeight: 400
        },
        proceedButton: {
            paddingTop: 12,
            paddingBottom: 12,
            marginTop: 6
        },
    }),
);

const CartSummary: React.FC<CartSummaryProps> = ({ className }) => {
    const classes = useStyles();
    const cartMenuRef = useRef<HTMLButtonElement>(null);
    const [cartMenuOpen, setCartMenuOpen] = useState(false);
    const { items: cartItems, totalQuantity, removeFromCart, totalPrice, clientCountry } = useContext(ShopContext);
    

    const handleCartOpen = () => {
        setCartMenuOpen(true);
    };

    const handleCartClose = () => {
        setCartMenuOpen(false);
    };

    const handleRemoveFromCart = (cartId: string) => () => {
        removeFromCart(cartId);
    }

    return (
        <div className={classes.root}>
            <div className={clsx(classes.title, className)}>Order Summary</div>
            <div className={classes.summaryRow}>
                <div className={classes.rowTitle}>Order Total</div>
                <div className={classes.rowValue}>{formatCurrency(totalPrice)}</div>
            </div>
            <div className={classes.summaryRow}>
                <div className={classes.rowTitle}>Shipping</div>
                <div className={classes.rowValue}>{formatCurrency(20)}</div>
            </div>
            <div className={classes.summaryRow}>
                <div className={classes.rowTitle}>Shipping to: </div>
                <div className={classes.rowValue}>{clientCountry}</div>
            </div>

            <Button _color='primary' className={classes.proceedButton} variant="contained" fullWidth color='primary' onClick={handleCartClose}>Procedd to Checkout</Button>
        </div>
    );
}

export default CartSummary;