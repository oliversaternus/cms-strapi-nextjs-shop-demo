import React, { useContext } from 'react';
import { NextPage } from 'next';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Page } from '../src/tools/Models';
import { getPage } from '../src/tools/Service';
import Error from './404';
import { ShopContext } from '../src/contexts/ShopContext';
import Image from '../src/components/styledComponents/StyledImage';
import CartSummary from '../src/components/shop/CartSummary';

const useStyles = makeStyles(() =>
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
        content: {
            padding: 32
        },
        cartSummary: {
            maxWidth: 400,
        },
        cartItemContainer: {
            display: 'flex'
        },
        cartItemImage: {
            height: 128,
            width: 128
        },
        cartItemCell: {
            padding: 24
        }
    }),
);

const CartPage: NextPage<{ page: Page }> = ({ page }) => {
    const { id, content } = page;
    const classes = useStyles();
    const { items: cartItems } = useContext(ShopContext);

    /*
    if (!id) {
        return <Error />;
    }
    */

    return (
        <div className={classes.root}>
            <div className={classes.container}>
                <div className={classes.content}>
                    {
                        cartItems.map(item => (
                            <div className={classes.cartItemContainer}>
                                <Image
                                    className={classes.cartItemImage}
                                    src={item.product.image?.formats.thumbnail.url + ''}
                                    previewUrl={item.product.image?.previewUrl}
                                />
                                <div className={classes.cartItemCell}>
                                    {item.product.name}
                                </div>
                                <div className={classes.cartItemCell}>
                                    {item.quantity}
                                </div>
                                <div className={classes.cartItemCell}>
                                    {(item.product.price || 0) * item.quantity}
                                </div>
                            </div>))
                    }
                </div>
                <CartSummary className={classes.cartSummary} />
            </div>
        </div>);
}

CartPage.getInitialProps = async (): Promise<{ page: Page }> => {
    const pageResponse = await getPage('cart');
    const page: Page = (!pageResponse.isError && pageResponse.data) || {};

    return { page };
}

export default CartPage;