import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../pages/home/Home';
import App from '../App';
import SearchPage from '../pages/search/SearchPage';
import FirebaseService from '../services/FirebaseService';

interface Props {
    firebaseService: FirebaseService;
}

const AppRoutes: React.FC<Props> = ({ firebaseService }) => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<App firebaseService={firebaseService} />} />
                <Route path="/home" element={<Home firebaseService={firebaseService} />} />
                <Route path="/search" element={<SearchPage firebaseService={firebaseService} />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;