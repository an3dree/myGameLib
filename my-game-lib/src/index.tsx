import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Root from './routes/root';
import FirebaseService from './services/FirebaseService';

const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG || '');
const firebaseService = new FirebaseService(firebaseConfig);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Root firebaseService={firebaseService} />
  </React.StrictMode>
);
