import React from 'react';

const getColor = (input: string) => {
    const extension = input.replace('.', '').toUpperCase();
    switch (extension) {
        case 'PDF':
            return '#f44336';
        case 'DOCX':
            return '#3f51b5';
        case 'DOC':
            return '#3f51b5';
        case 'CSV':
            return '#009688';
        case 'XLSX':
            return '#009688';
    }
    return '#ef6c00';
};

const FileTypeIcon: React.FC<{ className?: string, fileType: string }> = ({ className, fileType }) =>
    <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        viewBox="0 0 148.09106 148.09106"
        height="24px"
        width="24px">
        <g
            transform="translate(-35.223449,-54.28884)"
            id="layer1">
            <g
                transform="translate(-72.697311,-496.05224)"
                id="g979">
                <g
                    id="g933"
                    transform="matrix(6.1704613,0,0,6.1704613,107.92076,550.34108)">
                    <path
                        id="path929"
                        fill="none"
                        d="M 0,0 H 24 V 24 H 0 Z" />
                    <path
                        id="path931"
                        d="M 6,2 C 4.9,2 4.01,2.9 4.01,4 L 4,20 c 0,1.1 0.89,2 1.99,2 H 18 c 1.1,0 2,-0.9 2,-2 V 8 L 14,2 Z m 7,7 V 3.5 L 18.5,9 Z" />
                </g>
                <rect
                    y="623.85767"
                    x="123.11536"
                    height="42.295341"
                    width="81.217827"
                    id="rect935"
                    style={{ fill: getColor(fileType), fillOpacity: 1, strokeWidth: 2.4 }} />
                <text
                    y="0"
                    x="20.580359"
                    transform="matrix(1.0970539,0,0,1.0970539,-19.942374,241.54089)"
                    style={{ fill: '#ffffff', fontStyle: 'normal', fontVariant: 'normal', fontWeight: 'bold', fontStretch: 'normal', fontSize: 22.5, lineHeight: 1.25, fontFamily: 'sans-serif', textAlign: 'center', whiteSpace: 'pre' }}
                    id="text939"
                >
                    <tspan
                        x="142.28648"
                        y="376.27419">
                        <tspan
                            style={{ fill: '#ffffff', fontStyle: 'normal', fontVariant: 'normal', fontWeight: 'bold', fontStretch: 'normal', fontSize: 22.5, lineHeight: 1.25, fontFamily: 'sans-serif', textAlign: 'center', whiteSpace: 'pre' }}>{fileType.replace('.', '').toUpperCase()}</tspan></tspan></text>
            </g>
        </g >
    </svg >;

export default FileTypeIcon;