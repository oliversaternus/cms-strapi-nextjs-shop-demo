import React, { useMemo } from "react";
import clsx from "clsx";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Avatar, Theme } from "@material-ui/core";
import { QuoteSection } from '../../tools/Models';
import { parse } from 'marked';

interface QuoteProps {
    quote: QuoteSection;
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
        background: theme.palette.sectionStyles.quote?.background || theme.palette.backgrounds.main,
        color: theme.palette.sectionStyles.quote?.text || theme.palette.text.primary,
        position: 'relative',
        overflow: 'hidden'
    },
    container: {
        width: '100%',
        maxWidth: 640,
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 2
    },
    left: {
        flexDirection: 'row'
    },
    right: {
        flexDirection: 'row-reverse'
    },
    quoteContent: {
        paddingTop: 18,
        textAlign: 'center',
        opacity: 0.8,
        fontSize: 20,
        fontWeight: 300,
        color: theme.palette.sectionStyles.quote?.text || theme.palette.text.primary,
        '& *': {
            padding: 0,
            margin: 0,
            opacity: 0.8,
            fontSize: 20,
            fontWeight: 300,
            color: theme.palette.sectionStyles.quote?.text || theme.palette.text.primary,
        }
    },
    quoteIcon: {
        width: 48,
        height: 48,
        fill: theme.palette.sectionStyles.quote?.textLight || theme.palette.text.hint,
        opacity: 0.4
    },
    authorContainer: {
        padding: 24,
        display: 'flex',
        alignItems: 'center'
    },
    authorInnerContainer: {
        padding: 12
    },
    author: {
        fontSize: 20,
        fontWeight: 500,
        color: theme.palette.sectionStyles.quote?.text || theme.palette.text.primary
    },
    company: {
        fontSize: 14,
        fontWeight: 300,
        color: theme.palette.sectionStyles.quote?.text || theme.palette.text.primary
    },
    avatar: {
        width: 64,
        height: 64
    },
    '@media (max-width: 800px)': {
        root: {
            padding: 32,
            paddingTop: 48,
            paddingBottom: 48
        }
    }
}));

const Quote: React.FC<QuoteProps> = (props) => {
    const { className, style, quote } = props;
    const classes = useStyles();
    const parsedContent = useMemo(() => parse(quote.content || ''), [quote, quote.content]);
    return (
        <div
            style={style}
            className={clsx(classes.root, className)}
            id={quote.identifier}
        >
            <div className={clsx(classes.container)}>
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 8 8" className={classes.quoteIcon}>
                    <path d="M3,1.3C2,1.7,1.2,2.7,1.2,3.6c0,0.2,0,0.4,0.1,0.5c0.2-0.2,0.5-0.3,0.9-0.3c0.8,0,1.5,0.6,1.5,1.5c0,0.9-0.7,1.5-1.5,1.5     C1.4,6.9,1,6.6,0.7,6.1C0.4,5.6,0.3,4.9,0.3,4.5c0-1.6,0.8-2.9,2.5-3.7L3,1.3z M7.1,1.3c-1,0.4-1.8,1.4-1.8,2.3     c0,0.2,0,0.4,0.1,0.5c0.2-0.2,0.5-0.3,0.9-0.3c0.8,0,1.5,0.6,1.5,1.5c0,0.9-0.7,1.5-1.5,1.5c-0.7,0-1.1-0.3-1.4-0.8     C4.4,5.6,4.4,4.9,4.4,4.5c0-1.6,0.8-2.9,2.5-3.7L7.1,1.3z"></path>
                </svg>
                <div className={classes.quoteContent} dangerouslySetInnerHTML={{ __html: parsedContent }} />
                <div className={classes.authorContainer}>
                    <Avatar
                        className={classes.avatar}
                        alt={quote.author}
                        src={quote.image?.formats?.thumbnail?.url}
                    />
                    <div className={classes.authorInnerContainer}>
                        <div className={classes.author}>{quote.author}</div>
                        {quote.company && <div className={classes.company}>{quote.company}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Quote;