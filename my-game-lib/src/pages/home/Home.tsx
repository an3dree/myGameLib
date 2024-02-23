import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import './Home.css';
import { Logout } from "@mui/icons-material";
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import FirebaseService from "../../services/FirebaseService";

interface Props {
    firebaseService: FirebaseService
}

const Home: React.FC<Props> = ({ firebaseService }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = firebaseService.listenAuthState((user: User) => {
            setUser(user);
        });

        // Limpeza do efeito
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
            <h2>Home</h2>
            <h3><span>Welcome, </span>{user?.displayName}</h3>
            <Link to="/search">
                <IconButton title="Add a game">
                    <AddIcon />
                </IconButton>
            </Link>

        </div>
    );
};

export default Home;
