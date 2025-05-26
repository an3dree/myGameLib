import { useEffect, useMemo, useState } from "react";
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
import pcIcon from "../../assets/steam.svg";
import psIcon from "../../assets/playstation.svg";
import xboxIcon from "../../assets/xbox.svg";
import nintendoIcon from "../../assets/nintendo-switch.svg";
import { motion, AnimatePresence } from "framer-motion";
import EditGameModal from '../../components/EditGameModal/EditGameModal';


interface Props {
    firebaseService: FirebaseService
}

const platformIcons: Record<string, string> = {
    pc: pcIcon,
    playstation: psIcon,
    xbox: xboxIcon,
    nintendo: nintendoIcon,
};

const statuses = [
    { id: 1, name: 'Playing', slug: 'playing' },
    { id: 2, name: 'Plan-to-play', slug: 'toplay' },
    { id: 3, name: 'Completed', slug: 'completed' },
    { id: 4, name: 'On-hold', slug: 'on-hold' },
    { id: 5, name: 'Dropped', slug: 'dropped' },
    { id: 6, name: 'Owned', slug: 'owned' },
];

const getPlatformKey = (slug?: string) => {
    if (!slug) return '';
    if (slug.includes('playstation')) return 'playstation';
    if (slug.includes('xbox')) return 'xbox';
    if (slug.includes('nintendo')) return 'nintendo';
    if (slug === 'pc') return 'pc';
    return '';
};

const Home: React.FC<Props> = ({ firebaseService }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [games, setGames] = useState<Game[]>([]);
    // eslint-disable-next-line
    const [gameUser, setGameUser] = useState<GameUser>();
    const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [gameToEdit, setGameToEdit] = useState<Game | null>(null);

    const availablePlatforms = useMemo(() => {
        const platforms = new Set<string>();
        games.forEach((game) => {
            const platformKey = getPlatformKey(game.platform?.slug);
            if (platformKey) {
                platforms.add(platformKey);
            }
        });
        return Array.from(platforms);
    }, [games]);

    const filteredGames = useMemo(() => {
        if (!selectedPlatform) return games;
        return games.filter(game => getPlatformKey(game.platform?.slug) === selectedPlatform);
    }, [games, selectedPlatform]);

    useEffect(() => {
        const fetchData = async () => {

            if (!user) return;

            // Atualizar o estado do usuário
            setUser(user);

            // Obter informações do usuário
            const firebaseGameUser = await firebaseService.getUser(user.uid);
            setGameUser(firebaseGameUser as any);

            // Obter jogos do usuário
            if (firebaseGameUser) {
                const userGames = await firebaseService.getUserGames(firebaseGameUser.id);
                setGames(userGames);
            }
        };

        // Lidar com mudanças no estado de autenticação
        const unsubscribe = firebaseService.listenAuthState((user: User) => {
            setUser(user);
        });

        // Executar fetchData ao montar o componente ou quando o usuário mudar
        fetchData();

        // Limpar o listener de autenticação ao desmontar o componente
        return () => unsubscribe();
    }, [firebaseService, user]);

    const handleEditGame = (gameId: number) => {
        const game = games.find(g => g.id === gameId);
        if (game) {
            setGameToEdit(game);
            setEditModalOpen(true);
        }
    };

    const handleSaveGame = async (editedGame: Game) => {
        // Atualize no Firestore (adicione um método updateGameToUserCollection no FirebaseService)
        const userDoc = await firebaseService.getUser(user?.uid); // userId = UID do Auth
        const userDocId = userDoc.id;
        await firebaseService.updateGameToUserCollection(userDocId, editedGame);
        // Atualize o estado local
        setGames(games.map(g => g.id === editedGame.id ? editedGame : g));
        setEditModalOpen(false);
    };

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


            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 24 }}>
                {availablePlatforms.map(platform => (
                    <IconButton
                        key={platform}
                        onClick={() => setSelectedPlatform(platform === selectedPlatform ? null : platform)}
                        style={{
                            border: platform === selectedPlatform ? '2px solid #1976d2' : '2px solid transparent',
                            background: '#fff',
                            borderRadius: 8,
                        }}
                        title={platform.charAt(0).toUpperCase() + platform.slice(1)}
                    >
                        <img src={platformIcons[platform]} alt={platform} width={32} height={32} />
                    </IconButton>
                ))}
            </div>

            <div className="GamesWrapper">
                <AnimatePresence>
                    {filteredGames.length > 0 &&
                        filteredGames.map((game, i) => (
                            <motion.div
                                key={`${game.id}-${i}`}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{
                                    layout: { duration: 0.35, type: "spring" },
                                    opacity: { duration: 0.18 }
                                }}
                            >
                                <CardGameList
                                    gameTitle={game.name}
                                    genres={game.genres}
                                    metaScore={game.metacritic}
                                    platform={game.platform}
                                    imageUrl={game.background_image}
                                    platformIcon={game.platform?.slug}
                                    gameStatus={game.status?.slug}
                                    gameId={game.id}
                                    editGame={handleEditGame}
                                />
                            </motion.div>
                        ))
                    }
                </AnimatePresence>
                <EditGameModal
                    open={editModalOpen}
                    game={gameToEdit}
                    statuses={statuses}
                    onClose={() => setEditModalOpen(false)}
                    onSave={handleSaveGame}
                />
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
