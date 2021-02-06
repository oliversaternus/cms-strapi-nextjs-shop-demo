import React, { useContext } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core';
import { ShoppingCart } from '@material-ui/icons';
import Link from 'next/link';
import { ShopContext } from '../../contexts/ShopContext';
import Badge from '@material-ui/core/Badge';

type CartLinkProps = {
    cartURL: string;
    onClick?: () => void;
    className?: string;
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        cartIcon: {
            fill: theme.palette.componentStyles.navigation?.main.text || theme.palette.text.primary,
            height: 32,
            width: 32
        }
    }),
);

const CartLink: React.FC<CartLinkProps> = ({ cartURL, onClick, className }) => {
    const classes = useStyles();
    const { totalQuantity } = useContext(ShopContext);

    return (
        <Link href={cartURL}>
            <a className={className} onClick={onClick}>
                <Badge badgeContent={totalQuantity} color="secondary">
                    <ShoppingCart className={classes.cartIcon} />
                </Badge>
            </a>
        </Link >
    );
}

export default CartLink;