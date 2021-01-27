import React, { useState, useEffect, useRef, useContext } from 'react';
import { createStyles, makeStyles, withStyles } from '@material-ui/core/styles';
import { IconButton, useMediaQuery, Theme, MenuItem, Avatar } from '@material-ui/core';
import { Menu as MenuIcon, ArrowDropDown, ShoppingCart } from '@material-ui/icons';
import Link from 'next/link';
import clsx from 'clsx';
import Dialog from './styledComponents/StyledDialog';
import { NavigationArea } from '../tools/Models';
import Fade from '@material-ui/core/Fade';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuList from '@material-ui/core/MenuList';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandIcon from '@material-ui/icons/ArrowDropDown';
import Typography from '@material-ui/core/Typography';
import { CartContext } from '../contexts/CartContext';
import Badge from '@material-ui/core/Badge';
import Button from './styledComponents/StyledButton';

const Accordion = withStyles({
    root: {
        boxShadow: 'none',
        backgroundColor: 'transparent',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
        },
    },
    expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles((theme) => ({
    root: {
        color: theme.palette.componentStyles.navigation?.dialog?.text || theme.palette.text.primary,
        marginBottom: -1,
        minHeight: 56,
        width: '100%',
        '&$expanded': {
            minHeight: 56,
        },
    },
    content: {
        margin: 0,
        '&$expanded': {
            margin: 0,
        },
    },
    expanded: {},
}))(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiAccordionDetails);

type NavigationProps = {
    links?: NavigationArea;
    logoSrc?: string;
    transparent?: boolean;
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            background: theme.palette.componentStyles.navigation?.main.background || theme.palette.backgrounds.main,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            height: 84,
            position: 'fixed',
            zIndex: 1000,
            top: 0,
            left: 0,
            transition: 'background-color 0.225s linear, border-color 0.225s linear, box-shadow 0.45s linear',
            boxShadow: '0px 6px 8px rgba(0,0,0,0)',
        },
        transparent: {
            backgroundColor: 'transparent'
        },
        scrolled: {
            boxShadow: '0px 6px 8px rgba(0,0,0,0.08)'
        },
        container: {
            width: '100%',
            height: '100%',
            maxWidth: 1016,
            marginLeft: 32,
            marginRight: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexDirection: 'row',
            position: 'relative'
        },
        placeholder: {
            height: 84,
            width: '100%',
            backgroundColor: 'transparent'
        },
        logo: {
            display: 'flex',
            alignItems: 'center',
            width: '100%'
        },
        expandIcon: {
            fill: theme.palette.componentStyles.navigation?.dialog.text || theme.palette.text.primary
        },
        details: {
            paddingLeft: 16,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            overflowX: 'hidden',
        },
        summary: {
            paddingLeft: 0
        },
        logoImage: {
            height: 48,
            marginRight: 8
        },
        linkContainer: {
            position: 'absolute',
            right: 0,
            display: 'flex',
            alignItems: 'center'
        },
        mobileLinkContainer: {
            width: '100%',
            paddingTop: 32,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            minHeight: '75%',
            flexDirection: 'column'
        },
        link: {
            display: 'flex',
            alignItems: 'center',
            fontSize: 16,
            margin: 12,
            fontWeight: 300,
            color: theme.palette.componentStyles.navigation?.main.text || theme.palette.text.primary,
            transition: 'color 0.16s linear',
            userSelect: 'none',
            WebkitTapHighlightColor: 'transparent',
            '&:hover': {
                textDecoration: 'none',
                color: theme.palette.componentStyles.navigation?.main.textLight || theme.palette.primary.light
            }
        },
        homeLink: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
            WebkitTapHighlightColor: 'transparent',
            '&:hover': {
                textDecoration: 'none'
            }
        },
        transparentLink: {
            color: theme.palette.componentStyles.navigation?.transparent?.text || theme.palette.text.primary,
            opacity: 0.7,
            transition: 'opacity 0.16s linear',
            '&:hover': {
                color: theme.palette.componentStyles.navigation?.transparent?.text || theme.palette.text.primary,
                opacity: 1
            }
        },
        mobile: {
            color: theme.palette.componentStyles.navigation?.dialog.text || theme.palette.text.primary,
            fontSize: 24,
            fontWeight: 400,
            margin: 0,
            padding: 12
        },
        mobileSubLink: {
            fontSize: 18,
        },
        menuButton: {
            position: 'fixed',
            right: 8,
            top: 18,
            display: 'none'
        },
        menuIcon: {
            fill: theme.palette.componentStyles.navigation?.main.text || theme.palette.text.primary,
        },
        lightMenuIcon: {
            fill: theme.palette.componentStyles.navigation?.transparent?.text || theme.palette.text.primary,
        },
        navMenu: {
            background: theme.palette.componentStyles.navigation?.dialog.background || theme.palette.backgrounds.main,
        },
        menuLink: {
            margin: 0
        },
        cartIcon: {
            fill: theme.palette.componentStyles.navigation?.main.text || theme.palette.text.primary,
            height: 32,
            width: 32
        },
        cartItemContainer: {
            display: 'flex',
            width: 240,
            maxWidth: 240
        },
        cartItemCell: {
            padding: 24
        },
        linkMenuButton: {
            cursor: 'pointer',
            marginBottom: 0,
            paddingBottom: 12,
            border: 'none',
            backgroundColor: 'transparent',
            '&:focus': {
                outline: 'none'
            }
        },
        '@media (max-width: 800px)': {
            menuButton: {
                display: 'flex'
            },
            linkContainer: {
                display: 'none'
            },
            brandName: {
                fontSize: 16,
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start'
            },
            brandName2: {
                fontSize: 18
            },
            brandDivider: {
                display: 'none'
            },
        }
    }),
);

const Navigation: React.FC<NavigationProps> = ({ transparent, links, logoSrc }) => {
    const classes = useStyles();
    const [scrollTop, setScrollTop] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width:800px)');
    const [selectedLinkId, setSelectedLinkId] = useState<number>();
    const [selectedAccordionLinkId, setSelectedAccordionLinkId] = useState<number>();
    const linkMenuRefs = useRef<Array<HTMLButtonElement | null>>([]);
    const cartMenuRef = useRef<HTMLButtonElement>(null);
    const [cartMenuOpen, setCartMenuOpen] = useState(false);
    const { items: cartItems } = useContext(CartContext);

    useEffect(() => {
        setScrollTop(window.scrollY);
        const onScroll = () => {
            setScrollTop(window.scrollY);
        };
        document.addEventListener('scroll', onScroll);
        return () => document.removeEventListener('scroll', onScroll);
    }, []);

    const isScrolled = scrollTop > 16;

    const handleCloseMenu = () => {
        setMenuOpen(false);
        setSelectedAccordionLinkId(undefined);
    };

    const handleAccordionChange = (linkId: number) => () => {
        if (selectedAccordionLinkId === linkId) {
            setSelectedAccordionLinkId(undefined);
            return;
        }
        setSelectedAccordionLinkId(linkId);
    };

    const handleCartOpen = () => {
        setCartMenuOpen(true);
    };

    const handleCartClose = () => {
        console.log('clicked away');
        setCartMenuOpen(false);
    };

    return (
        <React.Fragment>
            <div className={clsx(classes.root, transparent && !isScrolled && classes.transparent, isScrolled && classes.scrolled)}>
                <div className={classes.container}>
                    <IconButton className={classes.menuButton} onClick={() => setMenuOpen(true)}>
                        <MenuIcon className={clsx(classes.menuIcon, transparent && !isScrolled && classes.lightMenuIcon)} />
                    </IconButton>
                    <div className={classes.logo}>
                        <Link href="/">
                            <a target="_self" className={classes.homeLink}>
                                <img src={logoSrc} className={classes.logoImage} />
                            </a>
                        </Link>
                    </div>
                    <div className={classes.linkContainer}>
                        {links?.map((link, index) => (link.links?.length || 0) > 1 ?
                            <React.Fragment key={link.id}>
                                <button
                                    tabIndex={0}
                                    ref={(e) => linkMenuRefs.current[index] = e}
                                    onClick={(e) => setSelectedLinkId(link.id)}
                                    className={clsx(classes.link, classes.linkMenuButton, transparent && !isScrolled && classes.transparentLink)}
                                >
                                    {link.title}
                                    <ArrowDropDown />
                                </button>
                                <Popper open={link.id === selectedLinkId} anchorEl={linkMenuRefs.current[index]} role={undefined} transition disablePortal>
                                    {({ TransitionProps, placement }) => (
                                        <Fade
                                            {...TransitionProps}
                                            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                                        >
                                            <Paper elevation={4}>
                                                <ClickAwayListener onClickAway={() => setSelectedLinkId(undefined)}>
                                                    <MenuList>
                                                        {links?.[index]?.links?.map(item =>
                                                            <MenuItem
                                                                key={item.id}
                                                                onClick={() => setSelectedLinkId(undefined)}
                                                            >
                                                                <Link href={item.path + ''} >
                                                                    <a target="_self" className={clsx(classes.link, classes.menuLink)}>{item.link}</a>
                                                                </Link>
                                                            </MenuItem>
                                                        )}
                                                    </MenuList>
                                                </ClickAwayListener>
                                            </Paper>
                                        </Fade>
                                    )}
                                </Popper>
                            </React.Fragment>
                            :
                            <Link href={link.links?.[0]?.path + ''} key={link.id}>
                                <a target="_self" className={clsx(classes.link, transparent && !isScrolled && classes.transparentLink)}>{link.title}</a>
                            </Link>
                        )}
                        <IconButton ref={cartMenuRef} onClick={handleCartOpen}>
                            <Badge badgeContent={cartItems.length} color="secondary">
                                <ShoppingCart className={classes.cartIcon} />
                            </Badge>
                        </IconButton>
                        <Popper open={cartMenuOpen} anchorEl={cartMenuRef.current} role={undefined} transition disablePortal>
                            {({ TransitionProps, placement }) => (
                                <Fade
                                    {...TransitionProps}
                                    style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                                >
                                    <Paper elevation={4}>
                                        <ClickAwayListener onClickAway={handleCartClose}>
                                            <div>
                                                {cartItems.map(cartItem => (
                                                    <div key={cartItem.id} className={classes.cartItemContainer}>
                                                        <Avatar
                                                            src={cartItem.product.image?.formats.thumbnail.url + ''}
                                                        />
                                                        <div className={classes.cartItemCell}>
                                                            {cartItem.product.name}
                                                        </div>
                                                        <div className={classes.cartItemCell}>
                                                            {cartItem.quantity}
                                                        </div>
                                                        <div className={classes.cartItemCell}>
                                                            {(cartItem.product.price || 0) * cartItem.quantity}
                                                        </div>
                                                    </div>
                                                ))}
                                                <Button _color='primary' link='/cart' onClick={handleCartClose}>Checkout</Button>
                                            </div>
                                        </ClickAwayListener>
                                    </Paper>
                                </Fade>
                            )}
                        </Popper>
                    </div>
                </div>
            </div>
            {!transparent && <div className={classes.placeholder} />}
            <Dialog
                navigation
                open={menuOpen && isMobile}
                onClose={handleCloseMenu}
                icon={
                    <div className={classes.logo}>
                        <Link href="/">
                            <a className={classes.homeLink} style={{ padding: 12, paddingTop: 4 }}>
                                <img src={logoSrc} className={classes.logoImage} />
                            </a>
                        </Link>
                    </div>
                }
                transition='slide-right'
                className={classes.navMenu}
            >
                <div className={classes.mobileLinkContainer}>
                    {links?.map((link, index) => (link.links?.length || 0) > 1 ?
                        <Accordion key={link.id} square expanded={link.id === selectedAccordionLinkId} onChange={handleAccordionChange(link.id)}>
                            <AccordionSummary className={classes.summary} expandIcon={<ExpandIcon className={classes.expandIcon} />}>
                                <Typography className={clsx(classes.link, classes.transparentLink, classes.mobile)}>{link.title}</Typography>
                            </AccordionSummary>
                            <AccordionDetails className={classes.details}>
                                {links?.[index]?.links?.map(item =>
                                    <Link href={item.path + ''} key={item.id}>
                                        <a className={clsx(classes.link, classes.mobile, classes.mobileSubLink)} onClick={handleCloseMenu}>{item.link}</a>
                                    </Link>
                                )}
                            </AccordionDetails>
                        </Accordion> :
                        <Link href={link.links?.[0]?.path + ''} key={link.id}>
                            <a className={clsx(classes.link, classes.mobile)} onClick={handleCloseMenu}>{link.title}</a>
                        </Link>
                    )}
                </div>
            </Dialog>
        </React.Fragment >
    );
}

export default Navigation;