import * as React from 'react';

interface PlatformTagProps {
    platformName: string
    boxColor: string;
    fontColor: string;
}

const PlatformTag: React.FC<PlatformTagProps> = ({ platformName, boxColor, fontColor }) => {

    return (
        <div style={{
            backgroundColor: boxColor,
            borderRadius: '2px',
            width: 'fit-content',
            margin: 4,
            paddingBottom: 2,
            paddingTop: 2,
            paddingRight: 4,
            paddingLeft: 4,
            lineHeight: '100%',
            display: 'flex'
        }}>
            <span style={{
                fontSize: 10,
                fontWeight: 500,
                color: fontColor
            }}>
                {platformName ? platformName.toUpperCase() : ''}
            </span>
        </div>
    );
}

export default PlatformTag;