import React, { useCallback, useState, useContext, useMemo } from "react";
import clsx from "clsx";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Theme, useMediaQuery } from "@material-ui/core";
import { Message, ContactSection } from '../../tools/Models';
import { createMessage } from '../../tools/Service';
import { NotificationContext } from '../../contexts/NotificationContext';
import StyledInput from '../styledComponents/StyledInput';
import Button from '../styledComponents/StyledButton';
import ReCAPTCHA from "react-google-recaptcha";
import { validate } from 'email-validator';
import { IntegrationsContext } from "../../contexts/IntegrationsContext";
import Dialog from '../styledComponents/StyledDialog';
import { parse } from 'marked';

interface ContactProps {
    contact: ContactSection;
    style?: React.CSSProperties;
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        width: '100%',
        padding: 48,
        paddingTop: 96,
        paddingBottom: 96,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        color: theme.palette.sectionStyles.contact?.text || theme.palette.text.primary,
        background: theme.palette.sectionStyles.contact?.background || theme.palette.backgrounds.main,
        position: 'relative',
        overflow: 'hidden'
    },
    container: {
        width: '100%',
        maxWidth: 1016,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        zIndex: 2
    },
    left: {
        flexDirection: 'row'
    },
    right: {
        flexDirection: 'row-reverse'
    },
    headline: {
        width: '100%',
        maxWidth: 1016,
        paddingTop: 6,
        paddingBottom: 12,
        margin: 0,
        fontSize: 40,
        fontWeight: 600,
        lineHeight: 1.2,
        color: theme.palette.sectionStyles.gallery?.text || theme.palette.text.primary
    },
    input: {
        width: '100%',
        maxWidth: 480,
        margin: 8
    },
    multiline: {
        height: 113
    },
    sendButton: {
        marginTop: 12
    },
    captchaContainer: {
        marginTop: 8,
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
    confirmRoot: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: '100%',
        width: '100%',
    },
    confirmContainer: {
        width: '100%',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        padding: 12,
    },
    '@media (max-width: 1000px)': {
        textContent: {
            width: '100%'
        }
    },
    '@media (max-width: 800px)': {
        root: {
            padding: 32,
            paddingTop: 48,
            paddingBottom: 48
        },
        headline: {
            fontSize: 28
        }
    }
}));

const Contact: React.FC<ContactProps> = (props) => {
    const { className, style, contact } = props;
    const classes = useStyles();
    const [message, setMessage] = useState<Message>({
        firstName: '',
        lastName: '',
        salutation: 'No salutation',
        email: '',
        content: '',
        subject: 'contact'
    });
    const [captchaCode, setCaptchaCode] = useState('');
    const { openNotification } = useContext(NotificationContext);
    const { captcha } = useContext(IntegrationsContext);
    const smallScreen = useMediaQuery('(max-width: 480px)');
    const tinyScreen = useMediaQuery('(max-width: 370px)');
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const parsedConfirmMessage = useMemo(() => parse(contact.confirmMessage || ''), [contact, contact.confirmMessage]);

    const handleClose = () => {
        setConfirmDialogOpen(false);
    };

    const handleOpen = () => {
        if (!validate(message.email)) {
            openNotification('error', 'Email is invalid');
            return;
        }
        if (!message.firstName || !message.email || !message.lastName || !message.content) {
            openNotification('error', 'Pleas fill all fields.');
            return;
        }
        setConfirmDialogOpen(true);
    };

    const sendMessage = useCallback(async () => {
        if (captcha?.enabled && !captchaCode) {
            openNotification('error', 'Please solve the captcha');
            return;
        }
        handleClose();
        if (!validate(message.email)) {
            openNotification('error', 'Email is invalid');
            return;
        }
        if (!message.firstName || !message.email || !message.lastName || !message.content) {
            openNotification('error', 'Pleas fill all fields.');
            return;
        }
        const response = await createMessage(message, captchaCode);
        if (response.isError) {
            openNotification('error', 'Message sending error');
            return;
        }
        setMessage({
            firstName: '',
            lastName: '',
            salutation: 'No salutation',
            email: '',
            content: '',
            subject: 'contact'
        });
        openNotification('success', 'Message sent!');
    }, [message, captchaCode, validate, openNotification]);

    return (
        <div
            style={style}
            className={clsx(classes.root, className)}
            id={contact.identifier}
        >
            <div className={classes.container}>
                {contact.headline && <div className={classes.headline}>{contact.headline}</div>}
                <StyledInput
                    placeholder='First Name'
                    className={classes.input}
                    value={message?.firstName}
                    onChange={(e) => setMessage({ ...message, firstName: e.target?.value })}
                />
                <StyledInput
                    placeholder='Last Name'
                    className={classes.input}
                    value={message?.lastName}
                    onChange={(e) => setMessage({ ...message, lastName: e.target?.value })}
                />
                <StyledInput
                    placeholder='Email'
                    className={classes.input}
                    value={message?.email}
                    onChange={(e) => setMessage({ ...message, email: e.target?.value })}
                />
                <StyledInput
                    placeholder='Message'
                    multiline
                    rows={8}
                    className={classes.input}
                    value={message?.content}
                    onChange={(e) => setMessage({ ...message, content: e.target?.value })}
                />
                <Button
                    _color='primary'
                    className={classes.sendButton}
                    onClick={handleOpen}
                    trackingEvent={{
                        category: 'Interaction',
                        action: 'Clicked Send Contact Form' + (contact.identifier ? ' #' + contact.identifier : ''),
                        label: 'Send'
                    }}
                >Send</Button>
            </div >
            <Dialog
                title="Send Message"
                open={confirmDialogOpen}
                onClose={handleClose}
                preventFullScreen={!smallScreen}
                transition='slide'

            >
                <div className={classes.confirmRoot}>
                    <div className={classes.confirmContainer}>
                        <div className={classes.message} dangerouslySetInnerHTML={{ __html: parsedConfirmMessage }}>

                        </div>
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
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="secondary"
                            onClick={sendMessage}
                            trackingEvent={{
                                category: 'Interaction',
                                action: 'Message sent ' + (contact.identifier ? ' #' + contact.identifier : ''),
                                label: 'Send'
                            }}
                        >Send</Button>
                    </div>
                </div>
            </Dialog>
        </div >
    );
};

export default Contact;