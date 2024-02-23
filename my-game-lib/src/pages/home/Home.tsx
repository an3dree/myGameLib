import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../utils/keys";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import './Home.css';
import { Logout } from "@mui/icons-material";
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';


const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(auth.currentUser);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
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
