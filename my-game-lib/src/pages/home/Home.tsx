import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import './Home.css';
import { Logout } from "@mui/icons-material";
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

// Inicialize o Firebase app
const firebaseConfigStr = process.env.REACT_APP_FIREBASE_CONFIG;
if (!firebaseConfigStr) {
    console.error('Firebase config not found in environment variables');
} else {
    try {
        const firebaseConfig = JSON.parse(firebaseConfigStr);
        initializeApp(firebaseConfig);
    } catch (error) {
        console.error('Error parsing firebase config:', error);
    }
}

const auth = getAuth(); // Obtenha a instância de autenticação do Firebase

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        // Limpeza do efeito
        return () => unsubscribe();
    }, []);

    const handleLogout = () => {
        auth.signOut()
            .then(() => {
                // Logout bem-sucedido, redirecionar para a página de login
                navigate('/');
            })
            .catch((error) => {
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
