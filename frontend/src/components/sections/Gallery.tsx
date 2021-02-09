import React, { useEffect, useRef } from "react";
import clsx from "clsx";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Theme } from "@material-ui/core";
import { GallerySection } from '../../tools/Models';
import Image from '../styledComponents/StyledImage';
// workaround for react bug: load vanilla JS module
import '../../../fslightbox-ssr';

interface GalleryProps {
    gallery: GallerySection;
    style?: React.CSSProperties;
    className?: string;
}

// declare some typing for vanilla JS class
declare class FsLightbox {
    props: {
        sources: string[];
    };
    open: (index?: number) => void;
    [key: string]: any;
};

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
        position: 'relative',
        overflow: 'hidden',
        background: theme.palette.sectionStyles.gallery?.background || theme.palette.backgrounds.main,
        color: theme.palette.sectionStyles.gallery?.text || theme.palette.text.primary
    },
    container: {
        width: '100%',
        maxWidth: 1016,
        display: 'flex',
        flexWrap: 'wrap'
    },
    rect: {
        flexBasis: '33.33333%',
        flexGrow: 1
    },
    square: {
        flexBasis: '20%',
        flexGrow: 1,
    },
    item: {
        padding: 4,
        height: 250
    },
    imageContainer: {
        height: '100%',
        width: '100%',
        overflow: 'hidden'
    },
    image: {
        height: '100%',
        width: '100%',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top center',
        transition: 'transform 0.225s linear'
    },
    clickable: {
        cursor: 'pointer',
        '&:hover': {
            transform: 'scale(1.048)'
        }
    },
    breaker: {
        width: '0%'
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
    '@media (max-width: 1000px)': {
        rect: {
            flexBasis: '50%',
        },
        square: {
            flexBasis: '25%'
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
    },
    '@media (max-width: 600px)': {
        rect: {
            flexBasis: '100%',
        },
        square: {
            flexBasis: '100%'
        }
    }
}));

const Gallery: React.FC<GalleryProps> = (props) => {
    const { className, style, gallery } = props;
    const classes = useStyles();
    const lightBoxRef = useRef<FsLightbox | null>(null);

    useEffect(() => {
        const lightbox = new FsLightbox();
        lightBoxRef.current = lightbox;
        lightbox.props.sources = gallery.images?.map(image => (image.url)) || [];
    }, [gallery]);

    const handleClick = (index: number) => () => {
        if (!lightBoxRef.current) {
            return;
        }
        lightBoxRef.current?.open?.(index);
    };

    return (
        <div
            style={style}
            className={clsx(classes.root, className)}
            id={gallery.identifier}
        >
            {gallery.headline &&
                <div className={classes.headline}>
                    {gallery.headline}
                </div>}
            <div className={classes.container}>
                {gallery.images?.map((image, index) =>
                    <div key={image.id} className={clsx(classes.item, index % 6 === 1 ? classes.square : classes.rect)}>
                        <div className={classes.imageContainer} onClick={handleClick(index)}>
                            <Image
                                className={clsx(classes.image, classes.clickable)}
                                src={image.url}
                                previewUrl={image.previewUrl}
                            />
                        </div>
                    </div>
                )}
            </div >
        </div >
    );
};

export default Gallery;