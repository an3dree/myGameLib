import React from "react";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../services/FirebaseConfig";
import { useNavigate } from "react-router-dom";
import { BottomNavigationAction, Button, IconButton } from "@mui/material";
import { BottomNavigation } from "@mui/material/"
import './Home.css';
import { Logout } from "@mui/icons-material";


const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

const user = auth.currentUser;


const Home: React.FC = () => {
    const navigate = useNavigate();
    console.log(user)
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
            <BottomNavigation title="Nav" >
                <span>text</span>
                <BottomNavigationAction label="Oi" icon="" value="test2" />
            </BottomNavigation>
        </div>
    );
};

export default Home;