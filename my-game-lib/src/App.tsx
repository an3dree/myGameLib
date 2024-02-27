import React from 'react';
import './App.css';
import SignInPage from './pages/signin/SignInPage';
import FirebaseService from './services/FirebaseService';

interface AppProps {
  firebaseService: FirebaseService
}

const App: React.FC<AppProps> = ({ firebaseService }) => {
  return (
    <div className="App">
      <SignInPage firebaseService={firebaseService} />
    </div>
  );
}

export default App;
