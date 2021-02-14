import * as React from "react";
import clsx from "clsx";
import { createStyles, makeStyles, fade } from "@material-ui/core/styles";
import { Theme } from "@material-ui/core";
import { TextSection } from '../../tools/Models';
import { parse } from 'marked';
import { useMemo } from "react";

interface TextProps {
    text: TextSection;
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
        background: theme.palette.sectionStyles.text?.background || theme.palette.backgrounds.main,
        color: theme.palette.sectionStyles.text?.text || theme.palette.text.primary,
        position: 'relative',
        overflow: 'hidden'
    },
    container: {
        width: '100%',
        maxWidth: 1016
    },
    textContent: {
        width: '100%',
        padding: 32,
        maxWidth: 1080,
        '& h1': {
            paddingTop: 6,
            paddingBottom: 12,
            margin: 0,
            fontSize: 44,
            fontWeight: 700,
            lineHeight: 1.2,
            color: theme.palette.sectionStyles.text?.text || theme.palette.text.primary
        },
        '& h2': {
            paddingTop: 6,
            paddingBottom: 12,
            margin: 0,
            fontSize: 36,
            fontWeight: 500,
            lineHeight: 1.2,
            color: theme.palette.sectionStyles.text?.text || theme.palette.text.primary
        },
        '& h3': {
            paddingTop: 6,
            paddingBottom: 12,
            margin: 0,
            fontSize: 30,
            fontWeight: 500,
            lineHeight: 1.2,
            color: theme.palette.sectionStyles.text?.text || theme.palette.text.primary
        },
        '& h4': {
            paddingTop: 6,
            paddingBottom: 12,
            margin: 0,
            fontSize: 28,
            fontWeight: 400,
            lineHeight: 1.2,
            color: theme.palette.sectionStyles.text?.text || theme.palette.text.primary
        },
        '& h5': {
            paddingTop: 6,
            paddingBottom: 12,
            margin: 0,
            fontSize: 28,
            fontWeight: 400,
            lineHeight: 1.2,
            color: theme.palette.sectionStyles.text?.text || theme.palette.text.primary
        },
        '& h6': {
            paddingTop: 6,
            paddingBottom: 12,
            margin: 0,
            fontSize: 28,
            fontWeight: 400,
            lineHeight: 1.2,
            color: theme.palette.sectionStyles.text?.text || theme.palette.text.primary
        },
        '& p': {
            margin: 0,
            marginTop: 18,
            fontSize: 17,
            fontWeight: 300,
            color: theme.palette.sectionStyles.text?.text || theme.palette.text.primary
        },
        '& ul': {
            margin: 0,
            paddingTop: 24,
            paddingBottom: 24,
            fontSize: 18,
            fontWeight: 400,
            color: theme.palette.sectionStyles.text?.text || theme.palette.text.primary,
            paddingLeft: 18
        },
        '& ol': {
            margin: 0,
            paddingTop: 24,
            paddingBottom: 24,
            fontSize: 18,
            fontWeight: 400,
            color: theme.palette.sectionStyles.text?.text || theme.palette.text.primary,
            paddingLeft: 18
        },
        '& img': {
            maxWidth: '100%',
            margin: 'auto',
            display: 'block'
        },
        '& table': {
            borderCollapse: 'collapse',
            fontSize: 17,
            fontWeight: 400,
            width: '100%'
        },
        '& td': {
            padding: 8
        },
        '& th': {
            textAlign: 'left',
            fontWeight: 600,
            padding: 8,
            paddingTop: 12,
            paddingBottom: 12,
            backgroundColor: theme.palette.sectionStyles.text?.text || theme.palette.text.primary,
            color: theme.palette.sectionStyles.text?.background || theme.palette.backgrounds.main
        },
        '& tr': {
            '&:nth-child(even)': {
                backgroundColor: fade(theme.palette.sectionStyles.text?.text || theme.palette.text.primary, 0.2)
            }
        }
    },
    '@media (max-width: 800px)': {
        textContent: {
            width: '100%'
        },
        root: {
            padding: 32,
            paddingBottom: 48,
            paddingTop: 48
        },
        details: {
            padding: 24,
            '& h1': {
                fontSize: 32,
            },
            '& h2': {
                fontSize: 28
            },
            '& h3': {
                fontSize: 24
            },
            '& h4': {
                fontSize: 20
            },
            '& h5': {
                fontSize: 18
            },
            '& h6': {
                fontSize: 18
            }
        }
    }
}));

const Text: React.FC<TextProps> = (props) => {
    const { className, style, text } = props;
    const classes = useStyles();
    const parsedContent = useMemo(() => parse(text.content || ''), [text]);
    return (
        <section
            style={style}
            className={clsx(classes.root, className)}
            id={text.identifier}
        >
            <div className={classes.container}>
                <div className={classes.textContent} dangerouslySetInnerHTML={{ __html: parsedContent }} />
            </div >
        </section>
    );
};

export default Text;