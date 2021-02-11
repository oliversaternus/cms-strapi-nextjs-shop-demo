import React, { useCallback, useState, useContext } from "react";
import clsx from "clsx";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Theme } from "@material-ui/core";
import { Message, ContactSection } from '../../tools/Models';
import { createMessage } from '../../tools/Service';
import { NotificationContext } from '../../contexts/NotificationContext';
import StyledInput from '../styledComponents/StyledInput';
import StyledDatePicker from '../styledComponents/StyledDatePicker';
import Button from '../styledComponents/StyledButton';
import { validate } from 'email-validator';

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
    const { openNotification } = useContext(NotificationContext);

    const sendMessage = useCallback(async () => {
        if (!validate(message.email)) {
            openNotification('error', 'Email is invalid');
            return;
        }
        if (!message.firstName || !message.email || !message.lastName || !message.content) {
            openNotification('error', 'Pleas fill all fields.');
            return;
        }
        const response = await createMessage(message);
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
    }, [message, validate, openNotification]);

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
                    onClick={sendMessage}
                    trackingEvent={{
                        category: 'Interaction',
                        action: 'Clicked Send Contact Form' + (contact.identifier ? ' #' + contact.identifier : ''),
                        label: 'Send'
                    }}
                >Send</Button>
            </div >
        </div >
    );
};

export default Contact;