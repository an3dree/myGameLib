import * as React from 'react';
import './CardGameList.css';
import metacriticIcon from '../../assets/metacritic.svg';
import pcIcon from '../../assets/steam.svg';
import psIcon from '../../assets/playstation.svg';
import xboxIcon from '../../assets/xbox.svg';
import nintendoIcon from '../../assets/nintendo-switch.svg';
import GenreTag from '../GenreTag/GenreTag';
import { Genre } from '../../models/SearchGenreResult';
import { Platform } from '../../models/SearchPlatformResult';
import { Tooltip } from '@mui/material';

interface CardGameListProps {
    gameTitle: string
    metaScore?: number;
    genres?: Genre[];
    platform?: Platform;
    platformIcon?: string;
    imageUrl?: string;
    gameStatus?: string;
    gameId?: number;
    editGame?: (gameId: number) => void;
}

const getPlatformIcon = (platformName?: string) => {
    if (platformName === 'pc') {
        return pcIcon;
    } else if (platformName?.includes('playstation')) {
        return psIcon;
    } else if (platformName?.includes('xbox')) {
        return xboxIcon;
    } else if (platformName?.includes('nintendo')) {
        return nintendoIcon;
    }

}

const getStatusIcon = (gameStatus?: string) => {
    if (gameStatus === 'playing') {
        return <span className='Playing'>🎮</span>;
    } else if (gameStatus === 'toplay') {
        return <span className='Toplay'>⏳</span>;
    } else if (gameStatus === 'completed') {
        return <span className='Completed'>🏆</span>;
    } else if (gameStatus === 'on-hold') {
        return <span className='Onhold'>⏸️</span>;
    } else if (gameStatus === 'dropped') {
        return <span className='Dropped'>🗑️</span>;
    } else if (gameStatus === 'owned') {
        return <span className='Owned'>💾</span>;
    }
}

const getStatusMessage = (gameStatus?: string) => {
    if (gameStatus === 'playing') {
        return <span className='GameStatus'>🟢  Playing</span>;
    } else if (gameStatus === 'toplay') {
        return <span className='GameStatus'>🔵  Plan-to-play</span>;
    } else if (gameStatus === 'completed') {
        return <span className='GameStatus'>🟣  Completed</span>;
    } else if (gameStatus === 'on-hold') {
        return <span className='GameStatus'>🟡  On-hold</span>;
    } else if (gameStatus === 'dropped') {
        return <span className='GameStatus'>🔴  Dropped</span>;
    } else if (gameStatus === 'owned') {
        return <span className='GameStatus'>🟤  Owned</span>;
    }
}


const CardGameList: React.FC<CardGameListProps> = ({
    gameTitle, metaScore, genres, platform, imageUrl, platformIcon, gameStatus, editGame, gameId
}) => {

    const imageTootip = (
        <>
            <strong>{gameTitle}</strong>
            <br />
            <div className='Metacritic'>
                <img width='15px' height='15px' src={metacriticIcon} alt="Metacrit Icon" />
                <strong>{metaScore}</strong>
            </div>

            {genres ?
                <div className='Genres'>
                    {genres.map(genre => {
                        return <GenreTag
                            genre={genre.name}
                            key={genre.id}
                        />
                    })}
                </div> : <></>}
        </>

    );
    return (
        <div className="CardGameList"
            onClick={() => { if (gameId !== undefined && editGame) editGame(gameId); }}
        >

            <Tooltip title={imageTootip} arrow placement='top'>
                <img
                    className='GameImage'
                    src={imageUrl}
                    alt={gameTitle}
                    style={{
                        width: 120,
                        height: 80,
                        objectFit: 'cover',
                        borderRadius: 8
                    }}
                />
            </Tooltip>

            <div className='BottomWrapper'>
                <Tooltip title={platform ? platform.name : ''} arrow placement='bottom'>
                    <div className='PlatformIcon'>
                        <img width='15px' height='15px' src={getPlatformIcon(platformIcon)} alt="Metacrit Icon" />

                    </div>
                </Tooltip>
                <Tooltip title={gameStatus ? getStatusMessage(gameStatus) : ''} arrow placement='bottom'>
                    <div className="GameStatusTag">
                        {gameStatus ? getStatusIcon(gameStatus) : <></>}
                    </div>
                </Tooltip>


            </div>

        </div>
    );
}

export default CardGameList;