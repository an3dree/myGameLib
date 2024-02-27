import * as React from 'react';
import './CardGameList.css';
import PlatformTag from '../PlatformTag/PlatformTag';
import metacriticIcon from '../../assets/metacritic.svg';
import GenreTag from '../GenreTag/GenreTag';
import { Genre } from '../../models/SearchGenreResult';
import { Platform } from '../../models/SearchPlatformResult';
import handlePlatformBoxColor from '../../utils/PlatformHelper';

interface CardGameListProps {
    gameTitle: string
    metaScore?: number;
    genres?: Genre[];
    platform?: Platform;
}

const CardGameList: React.FC<CardGameListProps> = ({ gameTitle, metaScore, genres, platform }) => {



    return (
        <div className="CardGameList">
            <PlatformTag
                platformName={platform ? platform?.name : ''}
                boxColor={platform ? handlePlatformBoxColor(platform.slug) : 'slategray'}
                fontColor='white'
            />
            <span className='GameTitle'>
                {gameTitle}
            </span>
            <div className='BottomWrapper'>

                <div className='Metacritic'>
                    <img width='15px' height='15px' src={metacriticIcon} alt="Metacrit Icon" />
                    <span>{metaScore}</span>
                </div>

                {genres ?
                    <div className='Genres'>
                        {genres.map(genre => {
                            return <GenreTag
                                genre={genre.name}
                                key={genre.id}
                            />
                        })}
                    </div> : <></>
                }


            </div>


        </div>
    );
}

export default CardGameList;