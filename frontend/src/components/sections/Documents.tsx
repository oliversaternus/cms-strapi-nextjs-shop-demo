import React, { useCallback, useRef } from "react";
import clsx from "clsx";
import { createStyles, makeStyles, fade } from "@material-ui/core/styles";
import { Theme } from "@material-ui/core";
import { DocumentsSection, File } from '../../tools/Models';
import Button from '../styledComponents/StyledButton';
import FileTypeIcon from '../../icons/FilteTypeIcon';

interface DocumentsProps {
    documents: DocumentsSection;
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
        maxWidth: 1016,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'column'
    },
    fileIcon: {
        width: 64,
        height: 64,
        minWidth: 64,
        minHeight: 64,
        fill: fade(theme.palette.sectionStyles.text?.text || theme.palette.text.primary, 0.4)
    },
    hidden: {
        display: 'none',
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
        color: theme.palette.sectionStyles.text?.text || theme.palette.text.primary
    },
    downloadContainer: {
        paddingTop: 12,
        paddingBottom: 12,
        width: `100%`,
        maxWidth: 480
    },
    downloadContainerContent: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: `100%`
    },
    downloadText: {
        display: 'flex',
        alignItems: 'center',
        fontSize: 20,
        fontWeight: 400,
        maxWidth: 340,
        color: theme.palette.sectionStyles.text?.text || theme.palette.text.primary
    },
    '@media (max-width: 640px)': {
        downloadContainerContent: {
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start'
        },
        root: {
            padding: 24,
            paddingTop: 48,
            paddingBottom: 48
        },
        downloadText: {
            paddingBottom: 12
        }
    }
}));

const Documents: React.FC<DocumentsProps> = (props) => {
    const { className, style, documents } = props;
    const classes = useStyles();
    const downloadRef = useRef<HTMLAnchorElement>(null);

    const downloadFile = useCallback((file: File) => async () => {
        const response = await fetch(file.url);
        if (!response.ok) {
            return;
        }
        const { current } = downloadRef;
        if (current) {
            const blob = await response.blob();
            const objectUrl = (window.URL || window.webkitURL).createObjectURL(blob);
            current.setAttribute('href', objectUrl);
            current.setAttribute('download', file.name);
            current.click();
        }
    }, []);

    const truncateFileName = useCallback((fileName: string) => {
        if (fileName.length > 20) {
            return fileName.substring(0, 20) + '...';
        }
        return fileName;
    }, []);

    return (
        <section
            style={style}
            className={clsx(classes.root, className)}
            id={documents.identifier}
        >
            <a ref={downloadRef} className={classes.hidden} />
            {documents.headline &&
                <div className={classes.headline}>
                    {documents.headline}
                </div>}
            <div className={classes.container}>
                {documents.files?.map(file => (
                    <div className={classes.downloadContainer} key={file.id}>
                        <div className={classes.downloadContainerContent}>
                            <div className={classes.downloadText}>
                                <FileTypeIcon className={classes.fileIcon} fileType={file.ext || ''} />
                                {file.alternativeText || truncateFileName(file.name)}
                            </div>
                            <Button
                                onClick={downloadFile(file)}
                                _color='primary'
                                trackingEvent={{
                                    category: 'Interaction',
                                    action: 'Clicked Download Button' + (documents.identifier ? ' #' + documents.identifier : ''),
                                    label: 'Download'
                                }}
                            >
                                {'Download'}
                            </Button>
                        </div>

                    </div>
                ))}
            </div>
        </section>
    );
};

export default Documents;