import React, { useState, useContext, useMemo, useCallback } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Dialog from '../styledComponents/StyledDialog';
import { Button, useMediaQuery } from '@material-ui/core';
import { parse } from 'marked';
import { Order } from '../../tools/Models';
import { ShopContext } from '../../contexts/ShopContext';
import { NotificationContext } from '../../contexts/NotificationContext';
import { createOrder } from '../../tools/Service';
import StyledInput from '../styledComponents/StyledInput';
import ReCAPTCHA from "react-google-recaptcha";
import { IntegrationsContext } from '../../contexts/IntegrationsContext';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            height: '100%',
            width: '100%',
        },
        container: {
            width: '100%',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            flexDirection: 'column',
            padding: 12,
        },
        input: {
            width: '100%',
            maxWidth: 480,
            margin: 8,
            marginLeft: 0,
            marginRight: 0
        },
        captchaContainer: {
            margin: 8,
            marginLeft: 0,
            marginRight: 0,
            width: '100%',
        },
        message: {
            paddingTop: 16,
            paddingBottom: 8,
            width: '100%',
            maxWidth: 420,
            '& h1': {
                fontSize: 20,
                fontWeight: 600
            },
            '& h2': {
                fontSize: 20,
                fontWeight: 600
            },
            '& h3': {
                fontSize: 18,
                fontWeight: 600
            },
            '& h4': {
                fontSize: 18,
                fontWeight: 600
            },
            '& h5': {
                fontSize: 14,
                fontWeight: 400
            },
            '& p': {
                margin: 0,
                fontSize: 14,
                fontWeight: 400
            },
            '& ul': {
                margin: 0,
                paddingLeft: 18,
                fontSize: 14,
                fontWeight: 400
            },
            '& ol': {
                margin: 0,
                paddingLeft: 18,
                fontSize: 14,
                fontWeight: 400
            },
        },
        buttonsContainer: {
            paddingTop: 16,
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
        },
        button: {
            marginLeft: 16
        },
        textField: {
            fontSize: 16
        },
        '@media (max-width: 800px)': {
            container: {
                padding: 0
            }
        }
    }),
);

const CheckoutDialog: React.FC<{ message?: string; open: boolean; onClose: () => void }> = ({ message, open, onClose }) => {
    const classes = useStyles();
    const parsedMessage = useMemo(() => parse(message || ''), [message]);
    const { items: cartItems, totalPrice, shippingCountry, shippingPrice } = useContext(ShopContext);
    const { captcha } = useContext(IntegrationsContext);
    const { openNotification } = useContext(NotificationContext);
    const smallScreen = useMediaQuery('(max-width: 480px)');
    const tinyScreen = useMediaQuery('(max-width: 370px)');
    const [captchaCode, setCaptchaCode] = useState('');
    const [customer, setCustomer] = useState<{ email: string; firstName: string; lastName: string }>({
        firstName: '',
        lastName: '',
        email: ''
    });

    const sendOrder = useCallback(async () => {
        if (!customer.email || !customer.firstName || !customer.lastName || !shippingCountry || !cartItems || !cartItems.length) {
            openNotification('error', 'Order form incomplete');
            return;
        }
        if (captcha?.enabled && !captchaCode) {
            openNotification('error', 'Please solve the captcha');
            return;
        }
        const order: Order = {
            ...customer,
            totalPrice,
            shippingPrice,
            shippingCountry,
            items: cartItems.map(cartItem => ({
                product: {
                    id: cartItem.product.id
                },
                quantity: cartItem.quantity
            }))
        };
        const response = await createOrder(order, captchaCode);
        if (response.isError) {
            openNotification('error', 'Order couldn\'t be placed');
            return;
        }
        openNotification('success', 'Order created. Check your inbox');
        onClose();
    }, [customer, shippingCountry, shippingPrice, cartItems, totalPrice, captcha, captchaCode]);

    return (
        <Dialog
            title="Submit Order"
            open={open}
            onClose={onClose}
            preventFullScreen={!smallScreen}
            transition='slide'

        >
            <div className={classes.root}>
                <div className={classes.container}>
                    <div className={classes.message} dangerouslySetInnerHTML={{ __html: parsedMessage }}>

                    </div>
                    <StyledInput
                        placeholder='First Name'
                        className={classes.input}
                        value={customer?.firstName}
                        inputClass={classes.textField}
                        onChange={(e) => setCustomer({ ...customer, firstName: e.target?.value })}
                    />
                    <StyledInput
                        placeholder='Last Name'
                        className={classes.input}
                        value={customer?.lastName}
                        inputClass={classes.textField}
                        onChange={(e) => setCustomer({ ...customer, lastName: e.target?.value })}
                    />
                    <StyledInput
                        placeholder='Email'
                        className={classes.input}
                        value={customer?.email}
                        inputClass={classes.textField}
                        onChange={(e) => setCustomer({ ...customer, email: e.target?.value })}
                    />
                    {captcha.enabled &&
                        <div className={classes.captchaContainer}>
                            <ReCAPTCHA
                                size={tinyScreen ? 'compact' : 'normal'}
                                key={tinyScreen + ''}
                                sitekey={captcha.publicKey || ''}
                                onChange={(token) => setCaptchaCode(token || '')}
                            />
                        </div>}
                </div>
                <div className={classes.buttonsContainer}>
                    <Button className={classes.button} variant="contained" color="secondary" onClick={sendOrder}>Submit</Button>
                </div>
            </div>
        </Dialog>
    );
}

export default CheckoutDialog;