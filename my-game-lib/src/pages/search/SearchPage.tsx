import React, { useEffect, useState } from 'react';
import searchGames from '../../services/SearchGame';
import Pagination from '@mui/material/Pagination';
import { SearchGameResult } from '../../models/SearchGameResult';
import CardGameResult from '../../components/CardGameResult/CardGameResult';
import AlertModal from '../../components/CustomAlert/CustomAlert';
import './SearchPage.css'
import { User } from 'firebase/auth';
import FirebaseService from '../../services/FirebaseService';
import { IconButton, Input, SelectChangeEvent } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Game } from '../../models/Game';
import AddGameModal from '../../components/AddGameModal/AddGameModal';
import { Platform } from '../../models/SearchPlatformResult';
import { GameStatus } from '../../models/GameStatus';
import { useNavigate } from 'react-router-dom';
import { GameUser } from '../../models/GameUser';

interface Props {
    firebaseService: FirebaseService
}




const SearchPage: React.FC<Props> = ({ firebaseService }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<SearchGameResult[]>([]);
    const [totalResults, setTotalResults] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [user, setUser] = useState<User | null>(null);
    const [gameUser, setGameUser] = useState<GameUser>();
    const [openModal, setOpenModal] = useState(false);
    const [selectedGame, setSelectedGame] = useState<SearchGameResult>();
    const [platforms, setPlatforms] = useState<Platform[]>([]);
    const [statuses, setStatuses] = useState<GameStatus[]>([]);
    const [game, setGame] = useState<Game>();
    const [selectedPlatform, setSelectedPlatform] = useState<Platform>();
    const [selectedStatus, setSelectedStatus] = useState<GameStatus>();
    const [alertMessage, setAlertMessage] = useState('');
    const [openAlert, setOpenAlert] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState<"success" | "error">("error");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const currentUser = await firebaseService.getCurrentUser();
                setUser(currentUser);

                if (currentUser) {
                    //console.log(currentUser);
                    const firebaseGameUser = await firebaseService.getUser(currentUser.uid);
                    setGameUser(firebaseGameUser as any);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const unsubscribe = firebaseService.listenAuthState((currentUser: User | null) => {
            setUser(currentUser);
        });

        fetchData();

        return () => unsubscribe();
    }, [firebaseService]);



    const handlePlatformChange = (event: SelectChangeEvent<Platform>) => {
        const platformName = event.target.value;


        const selectedPlatform: any = platforms.find((item: any) => item.platform.name === platformName);


        if (selectedPlatform) {
            setSelectedPlatform(selectedPlatform.platform);
        }

    }

    const handleStatusChange = (event: SelectChangeEvent<GameStatus>) => {
        const statusName = event.target.value;

        const selectedStatus: any = statuses.find((item: any) => item.name === statusName);
        console.log(statusName);
        if (selectedStatus) {
            setSelectedStatus(selectedStatus);
            console.log(selectedStatus);
        }


    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = async (page: number) => {
        const { results, totalCount } = await searchGames(searchTerm);
        setSearchResults(results);
        setTotalResults(totalCount);
        setCurrentPage(page);
    };

    const handlePaginationChange = async (event: React.ChangeEvent<unknown>, page: number) => {
        const { results } = await searchGames(searchTerm, page);
        setSearchResults(results);
        setCurrentPage(page);
    };

    const handleGoBack = () => {
        navigate('/home');
    }

    const handleOpenModal = async (game: SearchGameResult) => {
        await setSelectedGame(game);
        if (game) {
            setPlatforms(game.platforms);
            setStatuses([
                { id: 1, name: 'Playing', slug: 'playing' },
                { id: 2, name: 'Toplay', slug: 'toplay' },
                { id: 3, name: 'Completed', slug: 'completed' },
                { id: 4, name: 'On-hold', slug: 'onhold' },
                { id: 5, name: 'Dropped', slug: 'dropped' },
                { id: 6, name: 'Owned', slug: 'owned' }
            ])
        }
        setOpenModal(true);
    }

    const handleCloseModal = () => {
        setOpenModal(false);
    }

    const handleCloseAlert = () => {
        setOpenAlert(false);
    }

    const handleError = (errorMessage: string) => {
        setOpenAlert(true);
        setAlertMessage(errorMessage);
        setAlertSeverity("error");
    }

    useEffect(() => {
        const addGameToCollection = async () => {
            if (!game) return;
            try {
                const userId = gameUser?.id;
                await firebaseService.addGameToUserCollection(userId, game);

                setAlertSeverity("success");
                setAlertMessage('Game successfully added to user collection')
                setOpenAlert(true);
                setGame(undefined);
                setSelectedGame(undefined);

                setOpenModal(false);
                setSelectedPlatform(undefined);
                setSelectedStatus(undefined);



            } catch (error) {
                handleError(error instanceof Error ? error.message : "An error occurred");
                console.error('Error adding game to user collection:', error);
            }
        };

        addGameToCollection();
    }, [game, user, firebaseService, gameUser]);

    const onAddClick = async (selectedGame?: SearchGameResult): Promise<void> => {
        try {
            if (!selectedGame) {
                console.error('Game not selected');
                return;
            }

            setGame({
                id: selectedGame.id,
                background_image: selectedGame.background_image,
                status: selectedStatus,
                notes: '',
                platform: selectedPlatform,
                slug: selectedGame.slug,
                name: selectedGame.name,
                genres: selectedGame.genres,
                metacritic: selectedGame.metacritic
            });

            //console.log(selectedGame);
            //console.log(game);
            setSelectedPlatform(undefined);
            setSelectedStatus(undefined);

        } catch (e) {
            setOpenAlert(true);
        }

    };

    return (
        <div className='SearchPage'>
            <IconButton onClick={handleGoBack} style={{ position: 'absolute', top: 20, left: 20 }}>
                <ArrowBackIcon />
            </IconButton>
            <h1>Search and Add Game</h1>
            <div>
                <div className='SearchWrapper'>
                    <Input
                        type="text"
                        placeholder="Search for a game..."
                        value={searchTerm}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <IconButton onClick={() => handleSearch(currentPage)}><SearchIcon /></IconButton>
                </div>

                <div className='CardsWrapper'>
                    {searchResults.map((res: SearchGameResult) => {
                        return (
                            <CardGameResult
                                cardTitle={res.name}
                                key={res.id}
                                onAddClick={() => handleOpenModal(res)}
                            />
                        )
                    })}
                </div>
                {searchResults.length > 0 &&
                    <Pagination
                        count={Math.ceil(totalResults / 20)}
                        page={currentPage}
                        onChange={handlePaginationChange}
                        variant="outlined"
                        shape="rounded"
                    />
                }


            </div>
            <AlertModal
                message={alertMessage}
                severity={alertSeverity}
                onClose={handleCloseAlert}
                open={openAlert}
            />
            {openModal && (
                <AddGameModal
                    open={openModal}
                    handleClose={handleCloseModal}
                    game={selectedGame}
                    addGame={() => onAddClick(selectedGame)}
                    platforms={platforms}
                    statuses={statuses}
                    status={selectedStatus}
                    platform={selectedPlatform}
                    handlePlatformChange={handlePlatformChange}
                    handleStatusChange={handleStatusChange}
                />
            )}
        </div>
    );
};

export default SearchPage;
