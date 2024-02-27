import * as React from 'react';

interface GenreTagProps {
    genre: string
}

const GenreTag: React.FC<GenreTagProps> = ({ genre }) => {
    return (
        <div style={{
            display: 'flex',
            backgroundColor: 'slategray',
            borderRadius: 10,
            width: 'fit-content',
            paddingLeft: 5,
            paddingRight: 5,
            paddingBottom: 1
        }}>
            <span
                style={{
                    color: '#fff',
                    fontSize: 11
                }}
            >
                {genre}
            </span>
        </div>
    );
}

export default GenreTag;