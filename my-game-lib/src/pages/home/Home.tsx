import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import './Home.css';
import { Logout } from "@mui/icons-material";
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import FirebaseService from "../../services/FirebaseService";
import { Game } from "../../models/Game";
import CardGameList from "../../components/CardGameList/CardGameList";
import { GameUser } from "../../models/GameUser";

interface Props {
    firebaseService: FirebaseService
}

const Home: React.FC<Props> = ({ firebaseService }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [games, setGames] = useState<Game[]>([]);
    const [gameUser, setGameUser] = useState<GameUser>();

    useEffect(() => {
        const getUser = async () => {
            if (!user) return;
            const firebaseGameUser = await firebaseService.getUser(user.uid);
            console.log(firebaseGameUser);
            setGameUser(firebaseGameUser as any);

        };
        getUser();
    }, [firebaseService, user]);

    useEffect(() => {
        console.log(gameUser);
    }, [gameUser]);

    useEffect(() => {
        const getUserGames = async () => {
            if (!gameUser) return
            const userGames = await firebaseService.getUserGames(gameUser.id);
            //console.log(userGames);
            setGames(userGames);
            //console.log(games);
        };
        getUserGames();

    }, [firebaseService, gameUser, games]);

    useEffect(() => {
        const unsubscribe = firebaseService.listenAuthState((user: User) => {
            setUser(user);
        });


        return () => unsubscribe();
    }, [firebaseService]);

    const handleLogout = () => {
        firebaseService.signOut()
            .then(() => {
                // Logout bem-sucedido, redirecionar para a página de login
                navigate('/');
            })
            .catch((error: any) => {
                // Tratar erros de logout, se necessário
                console.error('Erro ao fazer logout:', error);
            });
    };

    return (
        <div className="Home">
            <IconButton onClick={handleLogout} style={{ position: 'absolute', top: 20, left: 20 }}>
                <Logout />
            </IconButton>
            <h1>My Game Lib</h1>
            <div className="GamesWrapper">
                {games.length > 0 &&
                    games.map(game => {

                        return (
                            <CardGameList
                                gameTitle={game.name}
                                genres={game.genres}
                                metaScore={game.metacritic}
                                key={game.id}
                                platform={game.platform}
                            />
                        );
                    })

                }
            </div>

            <Link to="/search" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 999 }}>

                <IconButton title="Add a game">

                    <AddIcon sx={{ height: 50, width: 50 }} />
                </IconButton>
            </Link>

        </div>
    );
};

export default Home;
