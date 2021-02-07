import React, { useContext } from 'react';
import { createStyles, makeStyles, fade } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core';
import { ShopContext } from '../../contexts/ShopContext';
import Button from '../styledComponents/StyledButton';
import { formatCurrency } from '../../tools/Utils';
import clsx from 'clsx';
import ReactCountryFlag from 'react-country-flag';
import Select from '../styledComponents/StyledSelect';
import { getName } from 'country-list';
import Tooltip from '../styledComponents/StyledTooltip';
import InfoIcon from '@material-ui/icons/InfoOutlined';

type CartSummaryProps = {
    className?: string;
    onProceed: () => void;
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            border: `1px solid ${fade(theme.palette.componentStyles.shop?.main.text || theme.palette.text.primary, 0.2)}`,
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
            color: theme.palette.componentStyles.shop?.main.text || theme.palette.text.primary,
            fontSize: 16,
            fontWeight: 600,
            borderBottom: `1px solid ${fade(theme.palette.componentStyles.shop?.main.text || theme.palette.text.primary, 0.2)}`,
            marginBottom: 12
        },
        summaryRow: {
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            paddingTop: 6,
            paddingBottom: 6,
            flexWrap: 'wrap'
        },
        rowTitle: {
            color: theme.palette.componentStyles.shop?.main.textStrong || theme.palette.componentStyles.shop?.main.text || theme.palette.text.primary,
            fontSize: 16,
            fontWeight: 400,
            paddingBottom: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start'
        },
        rowValue: {
            color: theme.palette.componentStyles.shop?.main.textLight || theme.palette.componentStyles.shop?.main.text || theme.palette.text.primary,
            fontSize: 16,
            fontWeight: 500
        },
        proceedButton: {
            marginTop: 18,
            paddingTop: 12,
            paddingBottom: 12
        },
        selectRoot: {
            width: '100%',
            paddingTop: 0,
            paddingBottom: 0,
            paddingRight: 0
        },
        select: {
            fontSize: 16
        },
        selectItem: {
            fontSize: 16
        },
        infoIcon: {
            marginLeft: 4,
            opacity: 0.8,
            height: 20,
            width: 20
        },
        divider: {
            width: '100%',
            paddingTop: 16,
            borderBottom: `1px solid ${fade(theme.palette.componentStyles.shop?.main.text || theme.palette.text.primary, 0.2)}`,
            marginBottom: 8
        }
    }),
);

const CartSummary: React.FC<CartSummaryProps> = ({ className, onProceed }) => {
    const classes = useStyles();
    const { shippingPrice, totalPrice, shippingCountry, setShippingCountry, availibleShippingCountries, shippingInfo, shopCurrency } = useContext(ShopContext);

    return (
        <div className={clsx(classes.root, className)}>
            <div className={classes.title}>Order Summary</div>
            <div className={classes.summaryRow}>
                <div className={classes.rowTitle}>Order Subtotal</div>
                <div className={classes.rowValue}>{formatCurrency(totalPrice, shopCurrency)}</div>
            </div>
            <div className={classes.summaryRow}>
                <div className={classes.rowTitle}>Shipping
                    {shippingInfo && <Tooltip placement='right-start' title={shippingInfo}><InfoIcon className={classes.infoIcon} /></Tooltip>}
                </div>
                <div className={classes.rowValue}>{formatCurrency(shippingPrice, shopCurrency)}</div>
            </div>
            <div className={classes.summaryRow}>
                <div className={classes.rowTitle} style={{ paddingBottom: 12 }}>Shipping Country</div>
                <div className={classes.rowValue} style={{ width: '100%' }}>
                    <Select
                        className={classes.selectRoot}
                        selectClass={classes.select}
                        menuItemClass={classes.selectItem}
                        value={shippingCountry}
                        onChange={(event) => setShippingCountry(event.target.value)}
                        values={availibleShippingCountries.map(code => (
                            {
                                label: getName(code) || '',
                                value: code,
                                startAdornment: () => <ReactCountryFlag style={{ marginRight: 8, width: '1.6em', height: '1.6em' }} svg countryCode={code} />
                            })
                        )}
                    />
                </div>
            </div>
            <div className={classes.divider} />
            <div className={classes.summaryRow}>
                <div className={classes.rowTitle}>Total</div>
                <div className={classes.rowValue}>{formatCurrency(totalPrice + shippingPrice, shopCurrency)}</div>
            </div>

            <Button _color='primary' className={classes.proceedButton} fullWidth color='primary' onClick={onProceed}>Proceed to Checkout</Button>
        </div>
    );
}

export default CartSummary;