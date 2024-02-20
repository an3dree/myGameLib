import React from "react";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../services/FirebaseConfig";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";


const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

const user = auth.currentUser;

const Home: React.FC = () => {
    const navigate = useNavigate();

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
        <div>
            <h1>My Game Lib</h1>
            <h2>Home</h2>
            <h3>{user?.email}</h3>
            <Button onClick={handleLogout}>Logout</Button>
        </div>
    );
};

export default Home;